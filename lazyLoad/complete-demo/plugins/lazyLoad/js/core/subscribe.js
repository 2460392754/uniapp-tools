class Subscribe {
    constructor() {
        this.data = {};
    }

    /**
     * 订阅
     * @param {object} o
     * @param {string} o.name
     * @param {string} o.guid
     * @param {object} o.context
     * @param {function} o.fn
     */
    on ({ name, guid, context, fn }) {
        this.data[name] || (this.data[name] = []);
        this.data[name].push({ guid, context, fn })

        return this.data[name].length - 1;
    }

    /**
     * 退订
     * @param {string} name 
     * @param {function} o.item 引用
     */
    off (name, item) {
        this.data[name] = this.data[name].filter(cuItem => {
            return cuItem != item;
        });
    }

    /**
     * 退订所有
     * @param {string} name 
     */
    offAll (name) {
        if (typeof name === 'undefined') {
            for (const KEY in this.data) {
                this.data[KEY] = [];
            }
        } else {
            this.data[name] = [];
        }
    }

    /**
     * 发布
     * @param {string} name 
     * @param {function} callback 
     */
    async emit (name, callback) {
        for (const item of this.data[name]) {
            let flag = await callback(item);

            if (flag === true) continue;
            else if (flag === false) break;
        }

        return Promise.resolve();
    }
}

export default Subscribe;