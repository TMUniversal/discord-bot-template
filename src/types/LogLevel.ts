/**
 * @author Hydractify
 * @see https://github.com/Hydractify/kanna_kobayashi
 */
import { ColorResolvable } from 'discord.js'

export enum LogLevel {
  NONE,
  ERROR,
  WARN,
  INFO,
  VERBOSE,
  DEBUG,
  SILLY
}

export interface IColor {
  /**
   * [background, foreground]
   */
  [index: number]: [number, number, ColorResolvable]
}

export const colors: IColor = {
  [LogLevel.ERROR]: [41, 31, 'RED'],
  [LogLevel.WARN]: [43, 33, 0xffff00],
  [LogLevel.INFO]: [42, 32, 'GREEN'],
  [LogLevel.VERBOSE]: [46, 36, 0x00ffff],
  [LogLevel.DEBUG]: [44, 34, 'BLUE'],
  [LogLevel.SILLY]: [45, 35, 0xff00ff],
  /**
   * Won't be logged, just here for completeness
   */
  [LogLevel.NONE]: [0, 0, 0]
}
