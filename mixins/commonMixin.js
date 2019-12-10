module.exports = {
    updateValue(e) {
        let name = e.currentTarget.dataset.name;
        let nameMap = {}
        nameMap[name] = e.detail && e.detail.value
        this.setData(nameMap)
    },
    trim(e) {
        let name = e.currentTarget.dataset.name;
        let nameMap = {};
        let result,str;
        str = e.detail && e.detail.value;
        if (str) {
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            // if (is_global && is_global.toLowerCase() == "g") {
            //     result = result.replace(/\s/g, "");
            // }
            nameMap[name] = result;
            this.setData(nameMap);
        }
    },
}