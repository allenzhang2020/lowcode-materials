export const globalStyleField = {
  type: 'group',
  title: '全局样式',
  name: 'globalStyle',
  extraProps: {
    display: 'accordion',
    defaultCollapsed: true,
  },
  items: [
    {
      name: 'tableLayout',
      title: {label:'表格布局',tip:'表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局'},
      display: 'inline',
      defaultValue: 'fixed',
      setter: {
        componentName: 'RadioGroupSetter',
        props: {
          options: [
            {
              title: '固定',
              value: 'fixed',
              tip: 'fixed',
            },
            {
              title: '自动',
              value: 'auto',
              tip: 'auto',
            },
          ],
        },
      },
    },
    {
      name: 'loading',
      title: '是否在加载中',
      display: 'inline',
      defaultValue: false,
      setter: 'BoolSetter',
    },
    {
      name: 'hasHeader',
      title: '是否具有头部',
      display: 'inline',
      defaultValue: true,
      setter: 'BoolSetter',
    },
    {
      name: 'hasBorder',
      title: '列分隔线',
      display: 'inline',
      defaultValue: true,
      setter: 'BoolSetter',
    },
    {
      name: 'isZebra',
      title: '斑马线',
      display: 'inline',
      defaultValue: true,
      setter: 'BoolSetter',
    },
    {
      name: 'fixedHeader',
      title: '固定表头',
      display: 'inline',
      defaultValue: true,
      setter: 'BoolSetter',
    },

    {
      name: 'size',
      title: '密度',
      display: 'inline',
      defaultValue: 'medium',
      setter: {
        componentName: 'RadioGroupSetter',
        props: {
          options: [
            {
              title: '紧凑',
              value: 'small',
              tip: 'small',
            },
            {
              title: '正常',
              value: 'medium',
              tip: 'medium',
            },
          ],
        },
      },
    },
    {
      name: 'tableWidth',
      title: {
        label: '表格的总长度',
        tip: '设置表格总长度 、设置部分列的宽度，这样表格会按照剩余空间大小，自动其他列分配宽度',
      },
      setter: {
        componentName: 'NumberSetter',
        props: {
          max: 20480,
          min: 1,
        },
        initialValue: 0
      },
    },
    {
      name: 'maxBodyHeight',
      title: {
        label: '最大内容区域的高度',
        tip: '最大内容区域的高度,在`fixedHeader`为`true`的时候,超过这个高度会出现滚动条',
      },
      setter: {
        componentName: 'NumberSetter',
        props: {
          max: 20480,
          min: 1,
        },
        initialValue: 500
      },
    },
  ],
};
