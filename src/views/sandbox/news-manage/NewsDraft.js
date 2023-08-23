import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      setdataSource(list)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: 'Edit',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)} />
            <Button shape="circle" icon={<EditOutlined/>} onClick={()=>{
              props.history.push(`/news-manage/update/${item.id}`)
            }}/>
            <Button type="primary" shape="circle" icon={<UploadOutlined/>} onClick={()=>handleCheck(item.id)}/>
          </div>
        )
      }
    },
  ];
  const handleCheck = (id) =>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.info({
          message: `Notification`,
          description: `Ahead to Audit List to check.`,
          placement: "bottomRight"
      })
  })
  }
  const confirmMethod = (item) => {
    Modal.confirm({
      title: 'Are you sure to delete this permission?',
      icon: <DeleteOutlined />,
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk() {
        //console.log('Record deleted');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };
  const deleteMethod = (item) => {
    //console.log(item)
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>
    </div>
  )
}

