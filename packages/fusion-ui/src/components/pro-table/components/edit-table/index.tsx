import * as React from 'react';
import { Button } from '@alifd/next';

import { ProTable, ProTableProps } from '../../index';
import { Space } from '@/components/container';
import { query, save } from '@/service/service';

export interface EditTableProps extends ProTableProps {
  addPosition?: 'end' | 'start';
  onSave?: (rowIndex: number, record: Record<string, any>, dataSource: any[]) => void;
  onRemove?: (rowIndex: number, record: Record<string, any>, dataSource: any[]) => void;
  onCancel?: (rowIndex: number, record: Record<string, any>, dataSource: any[]) => void;
  addRows?: boolean;
}

export const EditTable = function (props: EditTableProps) {
  const {
    columns: propColumns,
    primaryKey: propPrimaryKey,
    dataSource: propDataSource,
    actionColumnButtons: propActionColumnButtons = { dataSource: [] },
    onSave,
    onRemove,
    onCancel,
    addPosition = 'end',
    paginationProps : propPaginationProps,//如果这里增加了，那么otherProps会被排除调，要将这个属性加到protable上去
    serverProps: propServerProps,
    addRows: propAdds,
    ...otherProps
  } = props;
  const [primaryKey, setPrimaryKey] = React.useState(propPrimaryKey);
  const [dataSource, setDataSource] = React.useState(propDataSource);
  const dataSourceRef = React.useRef(dataSource);
  const [paginationProps, setPaginationProps] = React.useState(propPaginationProps);
  const paginationPropsRef = React.useRef(paginationProps);
  const [actionColumnButtons, setActionColumnButtons] = React.useState(propActionColumnButtons);
  function actionColumnButtonsHidden(showInEdit) {
    return ({ rowRecord }) => {
      return showInEdit ? !!rowRecord.editMode : !rowRecord.editMode;
    };
  }
  const defaultActionColumnButtons = propAdds ? [
    {
      children: '编辑',
      type: 'primary',
      onClick(e, payload) {
        const { rowKey, rowRecord } = payload;
        const _data = dataSourceRef.current.map((item) => {
          if (item[primaryKey] === rowKey) {
            return Object.assign(item, rowRecord, { editMode: true });
          }
          return item;
        });
        setDataSource(_data);
      },
      hidden: actionColumnButtonsHidden(true),
    },
    {
      children: '保存',
      type: 'primary',
      onClick(e, payload) {
        const { rowIndex, rowKey, rowRecord } = payload;
        const _data = dataSourceRef.current.map((item) => {
          if (item[primaryKey] === rowKey) {
            return Object.assign(item, rowRecord, { editMode: false });
          }
          return item;
        });
        onSave && onSave(rowIndex, rowRecord, _data);
        setDataSource(_data);
      },
      hidden: actionColumnButtonsHidden(false),
    },
    {
      children: '取消',
      type: 'primary',
      onClick(e, payload) {
        const { rowIndex, rowKey, rowRecord } = payload;
        const _data = dataSourceRef.current.map((item) => {
          if (item[primaryKey] === rowKey) {
            const keys = Object.keys(item);
            const originKeys = keys.filter((key) => key.startsWith('origin-'));
            originKeys.forEach((originKey) => {
              item[originKey.replace('origin-', '')] = item[originKey];
            });
            return Object.assign(item, { editMode: false });
          }
          return item;
        });
        onCancel && onCancel(rowIndex, rowRecord, _data);
        setDataSource(_data);
      },
      hidden: actionColumnButtonsHidden(false),
    },
    {
      children: '删除',
      type: 'primary',
      onClick(e, payload) {
        const { rowKey, rowIndex, rowRecord } = payload;
        dataSourceRef.current = dataSourceRef.current.filter((item) => item[primaryKey] !== rowKey);
        setDataSource(dataSourceRef.current);
        onRemove && onRemove(rowIndex, rowRecord, dataSourceRef.current);
      },
    },
  ] : [];

  //使用useCallback这样只会初始化一次
  const refreshDataSource = React.useCallback(async (currentPage: number, filterParam?:object)=>{
    const pageParm = {pageNum:currentPage,pageSize:paginationPropsRef.current.pageSize};
    
    //target对象会被修改
    let obj = filterParam;
    let pageVal = pageParm;
    if(obj != undefined){
      pageVal = Object.assign(obj, pageParm);
    }
    
    console.log('pageVal', pageVal);
    //首次查询
    
    //'/api/queryUserInfo'
      const data = await query(pageVal, propServerProps.queryUrl);
      console.log('data=',JSON.stringify(data),data);
      if(data.dataList == null){
        dataSourceRef.current = [];
      }else{
        dataSourceRef.current = data.dataList;
      }

      setDataSource(dataSourceRef.current);
  
      paginationPropsRef.current.total = data.total;
      paginationPropsRef.current.current = currentPage;
      setPaginationProps(paginationPropsRef.current);
      console.log('paginationProps init',paginationProps, propPaginationProps);
    
  },[]);

  React.useEffect(() => {
    propColumns.forEach((value)=>{
      if(value.isPrimaryKey != undefined && value.isPrimaryKey == true){
        setPrimaryKey(value.dataIndex);
      }
    })
    // console.log('is primary key 333', primaryKey);
  },[propPrimaryKey]);

  React.useEffect(() => {
    //初始化数据
    refreshDataSource(1, propServerProps.filterDatas);
  },[refreshDataSource, propServerProps.filterDatas]);//当第一次初始化和当propFilterProps发生变化是都会调用刷新数据的方法


  //保存数据
  const saveData = React.useCallback(async (datas?:object)=>{
    console.log('save data', datas);

    if(Object.keys(datas).length > 0){
      //'/api/saveUserInfo'
      const data = await save(datas, propServerProps.saveUrl);
      console.log('data=',JSON.stringify(data),data);

      //保存成功则重新查询数据
      refreshDataSource(1, propServerProps.filterDatas);
    }else{
      console.log('save data对象为空，不保存')
    }

  },[]);

  React.useEffect(() => {
    //初始化数据
    saveData(propServerProps.saveDatas);
  },[saveData, propServerProps.saveDatas]);//当第一次初始化和当propFilterProps发生变化是都会调用刷新数据的方法

  React.useEffect(() => {
    const { dataSource: actionColumnDataSource = [] } = propActionColumnButtons;
    const _actionColumnButtons = {
      ...actionColumnButtons,
      dataSource: defaultActionColumnButtons.concat(actionColumnDataSource),
    };
    setActionColumnButtons(_actionColumnButtons);
  }, [propActionColumnButtons, dataSource]);
  const tableAfter = (
    <Space className="row-add" align="center" justify="center" >
      <Button
        hidden={!propAdds}
        text
        type="primary"
        onClick={() => {
          let _data;
          if (addPosition && addPosition === 'start') {
            _data = [
              {
                [primaryKey]: `id-${Math.random().toString(36).substr(-6)}`,
                editMode: true,
              },
            ].concat(dataSource);
          } else {
            _data = dataSource.concat([
              {
                [primaryKey]: `id-${Math.random().toString(36).substr(-6)}`,
                editMode: true,
              },
            ]);
          }
          dataSourceRef.current = _data;
          setDataSource(_data);
        }}
      >
        +新增一行
      </Button>
    </Space>
  );

  const onPageItemChanged = async (value)=>{
    refreshDataSource(value);
  }

  return (
    <>
      <ProTable
        className="fusion-ui-edit-table"
        columns={propColumns}
        primaryKey={primaryKey}
        tableAfter={tableAfter}
        dataSource={dataSource}
        onPageItemChanged={onPageItemChanged}
        actionColumnButtons={actionColumnButtons}
        paginationProps={propPaginationProps}
        {...otherProps}
      />
    </>
  );
};
