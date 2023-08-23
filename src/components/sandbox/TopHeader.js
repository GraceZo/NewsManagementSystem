import React from 'react'
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';
import {withRouter} from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'

const { Header } = Layout;
function TopHeader(props) {
  const changeCollapsed = ()=>{
    //console.log(props)
    props.changeCollapsed()
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const onClick = ({ key }) => {
    //message.info(`Click on item ${key}`);
    localStorage.removeItem("token")
    //console.log(props.history)
    props.history.replace("/login")
  }
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const items = [
    {
      label: `${roleName}`,
      key: '1',
    },
    {
      key: '2',
      danger: true,
      label: 'Signout',
    }
  ];
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={changeCollapsed}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right", paddingRight:"15px" }}>
        <span>Welcome back, <span style={{color:"#1890ff"}}>{username}</span></span>
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps=({CollApsedReducer:{isCollapsed}})=>{
  //console.log(state)
  return {
    isCollapsed
  }
}
const mapDispatchToProps ={
  changeCollapsed(){
    return {
      type: "change_collapsed"
      //payload
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))