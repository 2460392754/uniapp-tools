import Tools from '../tools'

class Node {
    /**
     * 获取 scorll标签 数据
     * @param {string} id scroll标签的选择器
     * @param {object} ctx 上下文
     * @return {Promise<resolve>} label width and height style
     */
    getScrollLabelData = function (id, ctx) {
        return Tools.getNodeListData(id, ctx).then(res => {
            if (res === null) {
                return Tools.errorHandler('scroll样式id错误或未能获取当前属性')
            }

            return {
                width: res.width,
                height: res.height
            }
        });
    }

    /**
     * 检查需要加载图片的节点
     * @param {object} o1
     * @param {string} o1.guid 图片标签的选择器
     * @param {object} o1.context 上下文
     * @param {object} o2
     * @param {boolean} o2.horizontal 是否是横排（x轴）滑动
     * @param {number} o2.preLoadNum 预加载图片距离
     * @param {number} o2.width scroll label width style
     * @param {number} o2.height scroll label height style
     * @return {Promise<any>}
     */
    checkNeedLoad ({ guid, context }, { horizontal, preLoadNum, width, height }) {
        return Tools.getNodeListData(guid, context).then(res => {
            if (res === null) {
                return Promise.reject('无法获取当前图片的dom');
            }

            let { top, left } = res;
            let yAxis = top - preLoadNum <= height;
            let xAxis = left - preLoadNum <= width;

            if ((!horizontal && yAxis) || (horizontal && xAxis)) {
                Tools.debug(`>>>>>> checkNeedLoad success, guid: ${guid}`, 1)
                return Promise.resolve();
            }

            Tools.debug(`>>>>>> checkNeedLoad error, guid: ` + guid, 0)
            return Promise.reject('当前图片不在屏幕内');
        });
    }
}

export default Node;