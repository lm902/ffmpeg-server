#!/usr/bin/env node

const cp = require('child_process')
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  if (ctx.path !== '/') {
    ctx.throw(404)
  }
  if (!ctx.query.playlist) {
    ctx.throw(400)
  }
  try {
    ctx.status = 200
    ctx.type = 'video/MP2T'
    const ffmpeg = cp.spawn(`ffmpeg -i ${ctx.query.playlist.replace(/ /g, '')} -c copy pipe:.ts`, {
      shell: true
    })
    ffmpeg.stdout.pipe(ctx.res, null, true)
    await new Promise(resolve => ffmpeg.on('close', () => resolve()))
  } catch (e) {
    ctx.throw(e, 500)
  }
  await next()
})

app.listen(process.env.PORT || 8080)
