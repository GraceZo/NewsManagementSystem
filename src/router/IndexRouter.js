import React from 'react'
import {HashRouter,Route} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import { Redirect, Switch } from 'react-router-dom/cjs/react-router-dom.min'
import News from '../views/news/News'
import Details from '../views/news/Details'

export default function IndexRouter() {
  return (
    <HashRouter>
        <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/news" component={News}></Route>
            <Route path="/detail/:id" component={Details}></Route>
            <Route path="/" render={()=>
                localStorage.getItem("token")?
                <NewsSandBox></NewsSandBox>:
                <Redirect to="/login"/>
            }></Route>
        </Switch>
    </HashRouter>
  )
}
