import React, { forwardRef, useEffect, useState } from 'react'
import {Form, Input, Select} from 'antd'

const {Option} = Select
const UserForm = forwardRef((props,ref) => {
    const [isDisabled,setiSDisabled] = useState(false)
    useEffect(()=>{
      //console.log(props.isUpdateDisabled)
      setiSDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])
    const {roleId,region} = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor",
    }
    const checkRegionDisabled = (item) =>{
      if(props.isUpdate){
        if(roleObj[roleId]==="superadmin"){
          return false
        }else{
          return true
        }
      }else{
        if(roleObj[roleId]==="superadmin"){
          return false
        }else{
          return item.value!==region
        }
      }
    }
    const checkRoleDisabled = (item) =>{
      if(props.isUpdate){
        if(roleObj[roleId]==="superadmin"){
          return false
        }else{
          return true
        }
      }else{
        if(roleObj[roleId]==="superadmin"){
          return false
        }else{
          return roleObj[item.id]!=="editor"
        }
      }
    }
  return (
    <Form
          ref={ref}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="Region"
            rules={isDisabled?[]:[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Select disabled={isDisabled}>
              {
                props.regionList.map( item=> 
                  <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                )
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            rules={[
                {
                  required: true,
                  message: 'Please input the title of collection!',
                },
              ]}
          >
            <Select onChange={(value)=>{
                //console.log(ref)
                if(value===1){
                    setiSDisabled(true)
                    ref.current.setFieldsValue({
                        region:''
                    })
                }else{
                    setiSDisabled(false)
                }
            }}>
              {
                props.roleList.map( item=> 
                  <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                )
              }
            </Select>
          </Form.Item>
        </Form>
  )
})

export default UserForm 