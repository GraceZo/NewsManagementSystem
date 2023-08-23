import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import * as Echarts from 'echarts'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import _ from 'lodash'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

const { Meta } = Card
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [pieChart, setpieChart] = useState(null)
  const [open, setOpen] = useState(false)
  const barRef = useRef()
  const pieRef = useRef()
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  }
  useEffect(() => {
    if (open) {
        renderPieView()
    }
}, [open])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      //console.log(res.data)
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      //console.log(res.data)
      setstarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      //console.log(res.data)
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])
  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current)
    // Specify the configuration items and data for the chart
    var option = {
      title: {
        text: 'News Category Chart'
      },
      tooltip: {},
      legend: {
        data: ['Quantity']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: 'Quantity',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    }
    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option)
    window.onresize = () => {
      //console.log("resize")
      myChart.resize()
    }
  }
  const renderPieView = (obj) => {
    var currentList = allList.filter(item=>item.author===username)
    var groupObj = _.groupBy(currentList,item=>item.category.title)
    var list = []
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
    var myChart
    if(!pieChart){
      myChart = Echarts.init(pieRef.current)
      setpieChart(myChart)
    }else{
      myChart=pieChart
    }
    var option

    option = {
      title: {
        text: 'Proportion For All News',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Quantity',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option)
  }
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Most views" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Most stars" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                  showDrawer()
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "Global"}</b>
                  <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width="500px" title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <div ref={pieRef} style={{ height: "400px", marginTop: "30px" }}></div>
      </Drawer>
      <div ref={barRef} style={{ height: "400px", marginTop: "30px" }}></div>
    </div>
  )
}
