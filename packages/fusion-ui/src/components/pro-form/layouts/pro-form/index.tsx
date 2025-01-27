import moment from 'moment';
import * as React from 'react';
import classnames from 'classnames';
import { FormProps } from '@alifd/next/lib/form';
import { ResponsiveGrid, Form } from '@alifd/next';

import { ObjUtils } from '@/utils';
import { bizCssPrefix } from '@/variables';
import Operations from '@/common/operations';
import ProFormItem from '@/components/pro-form/components/form-item';
import { query } from '@/service/service';
import { useState } from 'react';

moment.locale('zh-cn');
const cssPrefix = `${bizCssPrefix}-pro-form`;

function getVisibleChildren(children: any[]) {
  return children.filter((child: any) => {
    return !child?.props?.invisible;
  });
}

export interface ProFormProps extends FormProps {
  columns: number;
  children: React.ReactChild;
  emptyContent: React.ReactNode | string;
  spacing: number;
  operations?: React.ReactNode | object[];
  operationConfig?: object;
  lastSaveTime?: number;
  device?: string;
  formItemsProps: Record<string, any>;
  serverProps: Record<string, any>;
}

export const calculateLastRows: Function = (children: any[], gridColumns: number) => {
  const rows: any[] = [];
  const childrenLength = children.length;
  for (let i = 0; i < childrenLength; ) {
    const subRows = [];
    let index = i;
    let sum = 0;
    let childColumnSpan =
      children[index].props.columnSpan || children[index].props.formItemProps?.columnSpan || 1;
    if (childColumnSpan >= gridColumns) {
      subRows.push(children[index].key);
    } else {
      while (index < childrenLength) {
        childColumnSpan =
          children[index].props.columnSpan || children[index].props.formItemProps?.columnSpan || 1;
        sum += childColumnSpan;
        if (sum > gridColumns) {
          index--;
          break;
        }
        subRows.push(children[index++].key);
      }
    }
    i = ++index;
    rows.push(subRows);
  }
  return rows;
};

export const formatFormItems: Function = (
  children: React.ReactChild,
  props: ProFormProps,
  formData: {},
  isChildForm: boolean,
) => {
  const {
    columns: gridColumns,
    size,
    device,
    labelAlign,
    labelTextAlign,
    labelCol,
    wrapperCol,
    colon,
    isPreview,
  } = props;

  let _children;

  if (!children) {
    return null;
  } else if (Array.isArray(children)) {
    _children = children.filter(
      (child: React.ReactElement) =>
        child && ['function', 'object', 'string'].indexOf(typeof child.type) > -1,
    );
  } else {
    _children = [children];
  }

  _children = getVisibleChildren(_children);

  const rows: any = calculateLastRows(_children, gridColumns);

  return React.Children.map(_children, (child: React.ReactElement) => {
    if (ObjUtils.isReactFragment(child)) {
      return formatFormItems(child.props.children, props, formData);
    }
    if (child && ['function', 'object'].indexOf(typeof child.type) > -1) {
      const _labelAlign = device === 'phone' ? 'top' : labelAlign;
      const childrenProps = {
        labelCol: child.props.labelCol ? child.props.labelCol : labelCol,
        wrapperCol: child.props.wrapperCol ? child.props.wrapperCol : wrapperCol,
        labelAlign: child.props.labelAlign ? child.props.labelAlign : _labelAlign,
        labelTextAlign: child.props.labelTextAlign ? child.props.labelTextAlign : labelTextAlign,
        colon: 'colon' in child.props ? child.props.colon : colon,
        size: child.props.size ? child.props.size : size,
        isPreview: child.props.isPreview ? child.props.isPreview : isPreview,
      };
      
      //defaultValue在child.props里面，下面赋值到componentProps
      const { formItemProps = {}, ...componentProps } = child.props || {};
      let { columnSpan = 1 } = formItemProps;
      if (!isChildForm && rows[rows.length - 1]?.includes(child.key)) {
        childrenProps.style = { marginBottom: '0px' };
      }
      if (
        ['ProFormItem', 'ChildForm'].includes(child.type.displayName) ||
        child.type?.displayName?.startsWith('Form')
      ) {
        if (child.type.displayName === 'ChildForm') {
          columnSpan = gridColumns;
        }

        //经过分析，页面使用下面的来生成
        return (
          <ResponsiveGrid.Cell colSpan={columnSpan}>
            {React.cloneElement(child, {
              defaultValue: componentProps.defaultValue ?  componentProps.defaultValue : (formData ? formData[formItemProps.name] : undefined),
              formItemProps: {
                ...ObjUtils.pickDefined(childrenProps),
                ...formItemProps,
              },
            })}
          </ResponsiveGrid.Cell>
        );
      }

      return (
        <ResponsiveGrid.Cell colSpan={columnSpan}>
          <ProFormItem {...childrenProps} {...formItemProps}>
            {React.cloneElement(child, componentProps)}
          </ProFormItem>
        </ResponsiveGrid.Cell>
      );
    }
    return child;
  });
};

const ProForm: React.ForwardRefRenderFunction<any, ProFormProps> = (props: ProFormProps, ref) => {
  const {
    children: propsChildren,
    columns,
    spacing = [0, 16, 16, 0],
    operations,
    operationConfig,
    emptyContent,
    lastSaveTime,
    formItemsProps: propsFormItemsProps,
    serverProps: propServerProps,
    ...otherProps
  } = props;

  const [children, setChildren] = useState(propsChildren);

  let formDataProps = {};
  const [formData, setFormData] = useState(formDataProps);
  
  //使用useCallback这样只会初始化一次
  const refreshDataSource = React.useCallback(async (propServerProps?:Record<string, any>)=>{
    //这里用的参数要从外面传进来，不然拿不到数据
    //QuerySysUserVo
    if(propServerProps.initFormData != undefined && propServerProps.initFormData){
        //'/api/queryUserInfo'
        const data = await query(propServerProps.filterDatas, propServerProps.queryUrl);
        console.log('data=',JSON.stringify(data),data);
        if(data.dataList != null){
          formDataProps = data.dataList[0];
          setFormData(formDataProps);
        }
    }
  },[]);

  React.useEffect(() => {
    if(propServerProps != undefined){
      //初始化数据
      refreshDataSource(propServerProps);
    }
    
  },[refreshDataSource, propServerProps]);//当第一次初始化和当propFilterProps发生变化是都会调用刷新数据的方法

  let { isPreview } = otherProps || {};
  if(propServerProps != undefined && propServerProps.filterDatas != undefined && propServerProps.filterDatas.isPreview != undefined){
    if(propServerProps.filterDatas.isPreview){
      isPreview = propServerProps.filterDatas.isPreview;//对于查看的操作，那么通常为只读
    }
  }

  const operationProps = { operations, operationConfig, lastSaveTime };
  return (
    <>
      <Form className={cssPrefix} {...otherProps} ref={ref} isPreview={isPreview}>
        {propsChildren ? (
          <ResponsiveGrid
            className={classnames(cssPrefix, +columns === 1 ? 'one-column' : '')}
            gap={spacing}
            columns={columns}
          >
            {formatFormItems(propsChildren, {
              columns,
              ...otherProps,
            },formData)}
          </ResponsiveGrid>
        ) : (
          <div className="empty-content">{emptyContent}</div>
        )}
        {isPreview ? null : <Operations {...operationProps} />}
      </Form>
    </>
  );
};

const RefProForm = React.forwardRef(ProForm);
RefProForm.displayName = 'ProForm';
RefProForm.defaultProps = {};
RefProForm.propTypes = {};
RefProForm.Item = ProFormItem;

export default RefProForm;
