/**
 * background, bg: 背景色
 * foreground, fg: 前景色（一般指字体颜色）
 */

export default [
  {
    name: '默认',
    key: 'default',
    vars: {
      sideBg: '#242A4B',
      sideFg: 'rgba(255, 255, 255, 0.65)',
      sideLogoBg: '#181D39',
      sideBgHover: '#1890FF',
      sideFgFocus: '#fff',
      sideBgActive: '#1890FF',
      loginBg: '#efefef'
    },
    primary: '#1890FF'
  },
  {
    name: '灰白',
    key: 'gray',
    vars: {
      sideBg: '#efefef',
      sideFg: '#333',
      sideLogoBg: '#dcdada',
      sideBgHover: '#ccc',
      sideFgFocus: '#409EFF',
      sideBgActive: '#ddd',
      loginBg: '#029ec4'
    },
    primary: '#409EFF'
  },
  {
    name: '暗黑',
    key: 'black',
    vars: {
      sideBg: '#333',
      sideFg: 'rgba(255, 255, 255, 0.65)',
      sideLogoBg: '#1f1d1d',
      sideBgHover: '#555',
      sideFgFocus: '#fff',
      sideBgActive: '#666',
      loginBg: '#efefef'
    },
    primary: '#666'
  },
  {
    name: '深蓝',
    key: 'blue',
    vars: {
      sideBg: '#156577',
      sideFg: 'rgba(255, 255, 255, 0.65)',
      sideLogoBg: '#005163',
      sideBgHover: '#407784',
      sideFgFocus: '#fff',
      sideBgActive: '#478694',
      loginBg: '#efefef'
    },
    primary: '#169ebb'
  },
  {
    name: '墨绿',
    key: 'green',
    vars: {
      sideBg: '#1d4a07',
      sideFg: 'rgba(255, 255, 255, 0.65)',
      sideLogoBg: '#133a00',
      sideBgHover: '#4e6742',
      sideFgFocus: '#fff',
      sideBgActive: '#68825c',
      loginBg: '#efefef'
    },
    primary: '#3a920e'
  }
]

export const varMapping = {
  sideBg: '--side-background',
  sideFg: '--side-foreground',
  sideLogoBg: '--side-logo-background',
  sideBgHover: '--side-background-hover',
  sideFgFocus: '--side-foreground-focus',
  sideBgActive: '--side-background-active',
  loginBg: '--login-background'
}
