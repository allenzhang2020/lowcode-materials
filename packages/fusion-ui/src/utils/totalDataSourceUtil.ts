import { formatAmount } from "./currency";

//获取number列
export const getNumberColumns = (propColumns: any[])=>{
    //遍历列
    return propColumns.filter((item)=>{
      return !item.hidden && (item.formatType == 'number' || item.formatType == 'money');
    });
  }

  //计算number列的回汇总数据
export const getTotalData = (columnsList: any[], dataSource: any[])=>{

    let totalData = {};
    //遍历列
    columnsList.forEach((item)=>{
      if(!item.hidden && (item.formatType == 'number' || item.formatType == 'money')){

        let totalVal = 0;
        //遍历数据
        dataSource.forEach((data)=>{
          //对象的值
          const objVal = data[item.dataIndex];
          totalVal = Number(totalVal) + Number(objVal);
        });

        let data = {};
        data[item.dataIndex] = formatAmount(totalVal)
        totalData = Object.assign(totalData, data);
      }

    });

    return totalData;
  }

    //格式化number列的回汇总数据
export const formatTotalData = (totalDataList: any)=>{

    let totalData = {};
    
    for(let i in totalDataList){
        console.log('item,index',i,totalDataList[i]);
        let data = {};
        data[i] = formatAmount(totalDataList[i])
        totalData = Object.assign(totalData, data);
    }

    return totalData;
  }