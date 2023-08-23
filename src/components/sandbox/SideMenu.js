import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import './index.css'
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import SubMenu from 'antd/es/menu/SubMenu'
const { Sider } = Layout
const iconList = {
  "/home": <AppstoreOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <SettingOutlined />,
  "/right-manage/role/list": <SettingOutlined />,
  "/right-manage/right/list": <SettingOutlined />
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      //console.log(res.data)
      setMenu(res.data)
    })
  }, [])
  const token = JSON.parse(localStorage.getItem("token"));
  let checkedRights = [];
  if (token && token.role && token.role.rights) {
    const { role: { rights } } = token;
    if (Array.isArray(rights)) {
      checkedRights = rights;
    } else if (rights.checked && Array.isArray(rights.checked)) {
      checkedRights = rights.checked;
    }
    // 在这里继续使用 checkedRights 进行后续操作
  } else {
    // 处理属性不存在的情况
  }
  //console.log(JSON.parse(localStorage.getItem("token")))
  const checkPagePermission = (item) => {
    return item.pagepermisson && checkedRights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      else if (checkPagePermission(item)) {
        return <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
      }
      else return null
    })
  }
  const selectKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="demo-logo-vertical">News Publishing Management System</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps =({CollApsedReducer:{isCollapsed}})=>({
  isCollapsed
})
export default connect(mapStateToProps)(withRouter(SideMenu))
