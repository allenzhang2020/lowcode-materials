export default [
  {
    name: 'items',
    title: '标签项',
    setter: {
      componentName: 'ArraySetter',
      props: {
        itemSetter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: 'title',
                  title: '名称',
                  defaultValue: '标签项',
                  important: true,
                  setter: 'StringSetter',
                },
                {
                  name: 'primaryKey',
                  title: '项目编号',
                  important: true,
                  // condition: () => false,
                  setter: 'StringSetter',
                },
                {
                  name: 'closeable',
                  title: '可关闭',
                  initialValue: false,
                  setter: 'BoolSetter',
                },
                {
                  name: 'disabled',
                  title: '是否禁用',
                  initialValue: false,
                  setter: 'BoolSetter',
                },
              ],
            },
          },
          initialValue: (target) => {
            return {
              primaryKey: 'tab'+String(Math.floor(Math.random() * 10000)),
              title: '标签项',
              closeable: false,
              disabled: false,
            };
          },
        },
      },
    },
    extraProps: {

      setValue(target, value) {
        const { node } = target;
        const map = {};
        if (!Array.isArray(value)) {
          value = [];
        }
        value.forEach((item) => {
          const tabitem = Object.assign({}, item);
          map[item.primaryKey] = tabitem;
        });

        node.children.mergeChildren(
          (child) => {
            const primaryKey = String(child.getPropValue('primaryKey'));
            if (Object.hasOwnProperty.call(map, primaryKey)) {
              child.setPropValue('title', map[primaryKey].title);
              child.setPropValue('closeable', map[primaryKey].closeable);
              child.setPropValue('disabled', map[primaryKey].disabled);
              delete map[primaryKey];
              return false;
            }
            return true;
          },
          () => {
            const items = [];
            for (const primaryKey in map) {
              if (Object.hasOwnProperty.call(map, primaryKey)) {
                items.push({
                  id : primaryKey,
                  componentName: 'TabContainer.Item',
                  props: map[primaryKey],
                });
              }
            }
            return items;
          },
          (child1, child2) => {
            const a = value.findIndex(
              (item) => String(item.primaryKey) === String(child1.getPropValue('primaryKey')),
            );
            const b = value.findIndex(
              (item) => String(item.primaryKey) === String(child2.getPropValue('primaryKey')),
            );
            return a - b;
          },
        );
      },
    },
  },
  {
    name: 'shape',
    title: '形态',
    defaultValue: 'pure',
    setter: {
      componentName: 'RadioGroupSetter',
      props: {
        options: [
          { title: '普通型', value: 'pure' },
          { title: '包裹型', value: 'wrapped' },
          { title: '文本型', value: 'text' },
          { title: '胶囊型', value: 'capsule' },
        ],
      },
    },
  },
  {
    name: 'size',
    title: '尺寸',
    defaultValue: 'medium',
    setter: {
      componentName: 'RadioGroupSetter',
      props: {
        options: [
          { title: '小', value: 'small' },
          { title: '中', value: 'medium' },
        ],
      },
    },
  },
  {
    name: 'activeKey',
    title: '当前激活选项卡key',
    extraProps: {
      display: 'inline',
      defaultValue: {
        "type": "JSExpression",
          "value": "this.state.activeKey"
      },
    }
  },
  {
    name: 'onClick',
    title: { label: '切换tab事件', tip: '点击按钮的回调函数' },
    propType: 'func',
    setter: [
      {
        componentName: 'FunctionSetter',
        props: {
          template:
            'onClick(currentKey,${extParams}){\n// 切换当前激活的tab页\n  this.setState({ activeKey: currentKey }); \n}',
        }
      }
    ]
  },
  {
    name: 'excessMode',
    title: '选项卡过多时的滑动模式',
    defaultValue: 'slide',
    setter: {
      componentName: 'RadioGroupSetter',
      props: {
        options: [
          { title: '滑动', value: 'slide' },
          { title: '下拉', value: 'dropdown' },
        ],
      },
    },
  },
  {
    name: 'tabPosition',
    title: {
      label: '导航选项卡的位置',
      tip: '只适用于包裹型（wrapped）选项卡',
    },
    condition: (target) => {
      const shape = target.getProps().getPropValue('shape');
      return shape === 'wrapped';
    },
    defaultValue: 'top',
    setter: {
      componentName: 'RadioGroupSetter',
      props: {
        options: [
          {
            title: '顶部',
            value: 'top',
          },
          {
            title: '底部',
            value: 'bottom',
          },
          {
            title: '左边',
            value: 'left',
          },
          {
            title: '右边',
            value: 'right',
          },
        ],
      },
    },
  },
];
