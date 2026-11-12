import QRCode from "qrcode";
import ipcLogo from "@ipc/logo";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export async function renderQrWithLogo(provisioningUri) {
  const size = 280;
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, provisioningUri, {
    errorCorrectionLevel: "H",
    margin: 3,
    width: size,
    color: {
      dark: "#0a244b",
      light: "#ffffff",
    },
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/png");

  const badgeWidth = 66;
  const badgeHeight = 36;
  const badgeX = (size - badgeWidth) / 2;
  const badgeY = (size - badgeHeight) / 2;

  ctx.save();
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 6);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0a244b";
  ctx.stroke();

  try {
    const logo = await loadImage(ipcLogo);
    const padX = 5;
    const padY = 4;
    ctx.drawImage(
      logo,
      badgeX + padX,
      badgeY + padY,
      badgeWidth - padX * 2,
      badgeHeight - padY * 2,
    );
  } catch {
    ctx.fillStyle = "#0a244b";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IPC", size / 2, size / 2);
  }
  ctx.restore();

  return canvas.toDataURL("image/png");
}
