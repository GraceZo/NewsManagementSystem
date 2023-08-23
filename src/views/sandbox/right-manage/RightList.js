import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch, Space } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RightList() {
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      const list = res.data
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setdataSource(list)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: 'Permissions',
      dataIndex: 'title'
    },
    {
      title: 'Path',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: 'Edit',
      render: (item) => {
        const content = (
          <div style={{ textAlign: "center" }}>
            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
          </div>
        )
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
            <Space wrap>
              <Popover content={content}
                title="Turn on/off" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                <Button shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
              </Popover>
            </Space>
          </div>
        )
      }
    },
  ];
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    //console.log(item)
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
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
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      //console.log(item.rightId)
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      //console.log(list,dataSource)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
