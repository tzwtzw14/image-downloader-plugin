const { exec } = require("child_process");
const path = require("path");
const os = require("os");

// 获取Chrome可执行文件路径
const chromePath = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Google",
  "Chrome",
  "Application",
  "chrome.exe"
);

// 构建打包命令
const command = `"${chromePath}" --pack-extension="${__dirname}" --pack-extension-key="${path.join(
  __dirname,
  "key.pem"
)}"`;

console.log("开始打包Chrome扩展...");
console.log("使用Chrome路径:", chromePath);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error("打包过程中出错:", error);
    return;
  }
  if (stderr) {
    console.error("打包警告:", stderr);
  }
  console.log("打包输出:", stdout);
  console.log("打包完成！");
  console.log("生成的文件：");
  console.log("- .crx 文件：扩展包文件");
  console.log("- .pem 文件：私钥文件（请妥善保管）");
});
