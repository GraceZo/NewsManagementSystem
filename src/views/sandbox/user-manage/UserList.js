import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from './UserForm'
import { connect } from 'react-redux'

const UsertList = (props)=>{
  const [open, setOpen] = useState(false)
  const [isUpdateOpen, setisUpdateOpen] = useState(false)
  const [updateItem, setUpdateItem] = useState(null)
  const [dataSource, setdataSource] = useState([])
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [current,setcurrent] = useState([])
  //const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor",
    }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region ===region&& roleObj[item.roleId]==="editor")
      ])
    })
  }, [roleId,region,username])
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])
  const columns = [
    {
      title: 'Region',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"Global",
          value:"global"
        }
      ],
      onFilter:(value,item)=>{
        if(value==="global"){
          return item.region===''
        }
        return item.region===value
      },
      render: (region) => {
        return <b>{region === '' ? 'Global' : region}</b>
      }
    },
    {
      title: 'Title',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
      }
    },
    {
      title: 'Edit',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => confirmMethod(item)} />
            <Button shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
          </div>
        )
      }
    },
  ]
  const changeisUpdateDisabled =()=>{
    props.changeisUpdateDisabled()
  }
  useEffect(() => {
    if (isUpdateOpen && updateForm.current && updateItem) {
      updateForm.current.setFieldsValue(updateItem)
    }
  }, [isUpdateOpen, updateForm, updateItem])
  const handleUpdate = (item) => {
    setisUpdateOpen(true);
    setUpdateItem(item)
    if(item.roleId===1){
      changeisUpdateDisabled(true)
    }else{
      changeisUpdateDisabled(false)
    }
    setcurrent(item)
  }
  const handleChange = (item) => {
    //console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const confirmMethod = (item) => {
    Modal.confirm({
      title: 'Are you sure to delete this user?',
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      //console.log(value)
      setOpen(false)
      addForm.current.resetFields()
      //先post到后端生成id，再设置datasource，方便后面的删除和更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false
      }).then(res => {
        //console.log(res.data)
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      }).catch(err => {
        console.log(err)
      })
    })
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      //console.log(value)
      setisUpdateOpen(false)
      setdataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      changeisUpdateDisabled()
      //setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`,value)
    })
  }
  return (
    <div>
      <Button type='primary' onClick={() => {
        setOpen(true)
      }}>Add user</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      <Modal
        open={open}
        title="Create a new user"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          setOpen(false)
  
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} ></UserForm>
      </Modal>
      <Modal
        open={isUpdateOpen}
        title="Update user"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setisUpdateOpen(false)
          changeisUpdateDisabled()
          //console.log(isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={props.isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
const mapStateToProps=({UserReducer:{isUpdateDisabled}})=>{
  //console.log(state)
  return {
    isUpdateDisabled
  }
}
const mapDispatchToProps ={
  changeisUpdateDisabled(){
    return {
      type: "change_isUpdateDisabled"
      //payload
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(UsertList)