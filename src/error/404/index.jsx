import React from "react";
import { Row, Col } from "antd";
import "./index.less";

const NotFound = () => {
  return (
    <Row className="not-found">
      <Col span={12} className="right">
        <h1>404</h1>
        <h2>抱歉，你访问的页面不存在</h2>
      </Col>
    </Row>
  );
};

export default NotFound;
