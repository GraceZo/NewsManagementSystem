import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            //console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])
            //console.log([...res[0].data,...res[1].data])
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
    }
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return checkedRights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            <Switch>
                {
                    BackRouteList.map(item => {
                        //console.log("Current item:", item); // 在这里添加 console.log
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return (
                                <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                            )
                        }
                        return null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    BackRouteList.length > 0
                    && <Route path="*" component={NoPermission}></Route>}
            </Switch>
        </Spin>
    )
}
const mapStateToProps =({LoadingReducer:{isLoading}})=>({
    isLoading
  })
export default connect(mapStateToProps)(NewsRouter)