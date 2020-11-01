import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Controls from "./Controls.react";
import HistoryTab from "./HistoryTab.react";
import ColoursCubeTab from "./ColoursCubeTab.react";
import CurrentLoadTab from "./CurrentLoadTab.react";
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Card } from 'antd';
const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Load balancing simulator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content>
        <div className={styles.container}>
          <Card>
            <Controls />
          </Card>
        </div>
      </Content>
      <Content>
        <div className={styles.container}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Current Load" key="1">
                <CurrentLoadTab />
              </TabPane>
              <TabPane tab="History Load" key="2">
                <HistoryTab />
              </TabPane>
              <TabPane tab="Coloured" key="3">
                <ColoursCubeTab />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}
