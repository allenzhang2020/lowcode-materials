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
