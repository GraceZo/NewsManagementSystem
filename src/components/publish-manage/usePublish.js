import { useEffect, useState } from "react"
import axios from 'axios'
import { notification } from "antd"

function usePublish(type) {
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            //console.log(res.data)
            setdataSource(res.data)
        })
    }, [username,type])
    const handlePublish = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: `Notification`,
                description: `Ahead to Publish manage/Published to check.`,
                placement: "bottomRight"
            })
        })
    }
    const handleOffline = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `Notification`,
                description: `Ahead to Publish manage/sunset to check.`,
                placement: "bottomRight"
            })
        })
    }
    const handleDelete = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `Notification`,
                description: `The news has been deleted successfully.`,
                placement: "bottomRight"
            })
        })
    }
    return {
        dataSource,
        handlePublish,
        handleOffline,
        handleDelete
    }
}
export default usePublish