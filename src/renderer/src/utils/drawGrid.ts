// グリッド線を描画する関数
export const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
  ctx.lineWidth = 0.5

  // Draw central vertical line
  ctx.beginPath()
  ctx.setLineDash([]) // Solid line
  ctx.moveTo(Math.floor(width / 2), 0)
  ctx.lineTo(Math.floor(width / 2), height)
  ctx.stroke()

  // Draw central horizontal line
  ctx.beginPath()
  ctx.setLineDash([]) // Solid line
  ctx.moveTo(0, Math.floor(height / 2))
  ctx.lineTo(width, Math.floor(height / 2))
  ctx.stroke()

  // Draw vertical grid lines
  for (let x = Math.floor(width / 2) + 50; x <= width; x += 50) {
    ctx.beginPath()
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let x = Math.floor(width / 2) - 50; x >= 0; x -= 50) {
    ctx.beginPath()
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Draw horizontal grid lines
  for (let y = Math.floor(height / 2) + 50; y <= height; y += 50) {
    ctx.beginPath()
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  for (let y = Math.floor(height / 2) - 50; y >= 0; y -= 50) {
    ctx.beginPath()
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}
