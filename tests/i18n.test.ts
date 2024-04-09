import {expect, test} from "bun:test";
import {I18n} from '../src/utils'

const i18n = new I18n('zh_cn', './config/languages').build() as any

test("i18n", async () => {
    expect(i18n['bot.disabled']).toBe('[Hippodamia]成功关闭赛马能力!');
});