document.getElementById("downloadBtn").addEventListener("click", async () => {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = "正在获取图片...";

  try {
    // 获取当前活动标签页
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // 在页面中执行脚本获取所有图片
    const images = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const images = document.getElementsByTagName("img");
        return Array.from(images).map((img) => ({
          src: img.src,
          alt: img.alt || "未命名图片",
          width: img.width,
          height: img.height,
        }));
      },
    });

    const imageList = images[0].result;

    if (imageList.length === 0) {
      statusDiv.textContent = "未找到任何图片";
      return;
    }

    statusDiv.textContent = `找到 ${imageList.length} 张图片，准备打包...`;

    // 创建一个新的 JSZip 实例
    const zip = new JSZip();
    let completedCount = 0;
    let successCount = 0;

    // 创建一个函数来将图片添加到 zip
    const addImageToZip = async (img, index) => {
      try {
        const response = await fetch(img.src, {
          mode: "no-cors",
          cache: "no-cache",
        }).catch((e) => null);

        if (!response) throw new Error("无法获取图片");

        const blob = await response.blob();
        // 清理文件名，避免特殊字符
        const cleanAlt = img.alt.replace(/[\\/:*?"<>|]/g, "_");
        const filename = `${cleanAlt || "image"}_${index + 1}.jpg`;

        // 添加图片到 zip
        zip.file(filename, blob);

        completedCount++;
        successCount++;
        statusDiv.textContent = `正在处理: ${completedCount}/${imageList.length} 张图片`;

        return true;
      } catch (error) {
        console.error(`获取图片失败: ${img.src}`, error);
        completedCount++;
        statusDiv.textContent = `正在处理: ${completedCount}/${imageList.length} 张图片`;
        return false;
      }
    };

    // 使用 Promise.all 并行处理所有图片
    const promises = imageList.map((img, index) => addImageToZip(img, index));
    await Promise.all(promises);

    if (successCount === 0) {
      statusDiv.textContent = "所有图片处理失败，请刷新页面重试";
      return;
    }

    statusDiv.textContent = `正在生成 ZIP 文件...`;

    // 生成 zip 文件
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // 创建一个 URL 对象
    const zipUrl = URL.createObjectURL(zipBlob);

    // 使用 Chrome 下载 API 下载 zip 文件
    const downloadId = await chrome.downloads.download({
      url: zipUrl,
      filename: "web_images.zip",
      saveAs: true,
    });

    // 监听下载完成事件，释放 URL 对象
    chrome.downloads.onChanged.addListener(function onChanged(delta) {
      if (
        delta.id === downloadId &&
        (delta.state?.current === "complete" ||
          delta.state?.current === "interrupted")
      ) {
        URL.revokeObjectURL(zipUrl);
        chrome.downloads.onChanged.removeListener(onChanged);
      }
    });

    statusDiv.textContent = `打包完成！共 ${successCount} 张图片已成功打包`;
  } catch (error) {
    console.error("处理图片失败:", error);
    statusDiv.textContent = "处理图片失败，请刷新页面重试";
  }
});
