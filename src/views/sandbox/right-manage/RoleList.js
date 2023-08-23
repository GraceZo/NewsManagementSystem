import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      dataIndex: 'roleName',
      render: (id) => {
        return id
      }
    },
    {
      title: 'Edit',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
            <Button shape="circle" icon={<EditOutlined />} onClick={() => {
              setIsModalOpen(true)
              setcurrentRights(item.rights)
              setcurrentId(item.id)
            }} />
          </div>
        )
      }
    }
  ]
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
  }
  const deleteMethod = (item) => {
    //console.log(item)
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }
  useEffect(() => {
    axios.get("/roles").then(res => {
      //console.log(res.data)
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      //console.log(res.data)
      setrightList(res.data)
    })
  }, [])
  const handleOk = () => {
    //console.log(currentRights)
    setIsModalOpen(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onCheck = (checkedKeys) => {
    //console.log('onCheck', checkedKeys, info);
    setcurrentRights(checkedKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="Role Permissions" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          checkStrictly={true}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}

