const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(cors());

// 创建连接池
const pool = mysql.createPool(
    'mysql://root:123456@localhost:3306/task?allowPublicKeyRetrieval=true&ssl=false'
)
// 获取 Promise 风格连接池
const promisePool = pool.promise();

app.get('/data', async (req, res) => {
    console.log('收到 /data 请求');
    try {
        // 获取字段映射
        const [fieldMapper] = await promisePool.query(
            'SELECT f_name,db_name,unit FROM t_sensor_field_mapper WHERE visible = 1'
        );

        // 构建字段映射
        const fieldMapping = {};
        const fieldUnit = {}
        fieldMapper.forEach(item => {
            fieldMapping[item.db_name] = item.f_name;
            fieldUnit[item.db_name] = item.unit
        });

        const searchMapper = ['id', 'd_no AS 设备编号'];
        for (let key in fieldMapping) {
            searchMapper.push(`${key} AS \`${fieldMapping[key]}\``);
        }
        searchMapper.push('online AS 数据类型');
        searchMapper.push('c_time AS 创立时间');


        const [sensorData] = await promisePool.query(
            `SELECT ${searchMapper.join(',')} FROM t_sensor_data ORDER BY id`
        );

        const proccessData = sensorData.map(item => {
            Object.keys(fieldMapping).forEach(elem => {
                const label = fieldMapping[elem]
                const unit = fieldUnit[elem]
                if (unit && item[label]) {
                    item[label] = `${item[label]} ${unit}`
                }
            })
            return item
        })
        // t_error_msg
        const [errorMapper] = await promisePool.query('select id ,d_no as `设备编号`,c_time as `更新时间`,e_msg as `故障原因` from t_error_msg')
        console.log(errorMapper)
        const sortedData = errorMapper.reduce((acc, item) => {
            const deviceNo = item.设备编号; 
            if (!acc[deviceNo]) acc[deviceNo] = [];
            acc[deviceNo].push(item); 
            return acc;
        }, {})
        // console.log(sortedData)

        //t_behavior_data
        const fieldName = {};
        const [behaviorField] = await promisePool.query('select db_name,p_name from t_behavior_field_mapper')
        behaviorField.forEach(item => {
            fieldName[item.db_name] = item.p_name;
        });

        const searchBehavior = ['id', 'd_no AS 设备编号'];
        Object.keys(fieldName).forEach(key => {
            searchBehavior.push(`${key} AS \`${fieldName[key]}\``);
        });
        searchBehavior.push(`online AS 数据类型`);
        searchBehavior.push(`field5 AS 更新时间`);

        let [behaviorOutcome] = await promisePool.query(
            `SELECT ${searchBehavior.join(',')} FROM t_behavior_data`
        );
        behaviorOutcome = behaviorOutcome.map(item => {
            for (let key in fieldName) {
                const label = fieldName[key]
                const unit = fieldUnit[key]
                if (unit) {
                    item[label] = `${item[label]} ${unit}`
                }
            }
            return item
            // 如果在内层循环里面return ，会导致每次都只有对象里面的第一个字段拥有单位,变量会出错
        })
        console.log(behaviorOutcome)

        res.json({
            success: true,
            message: '成功了',
            proccessData,
            sortedData,
            behaviorOutcome
        });
    } catch (err) {
        console.error('处理失败:', err);
        res.status(500).send('数据处理失败');
    }
});

const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(3000, () => {
    console.log('服务器正在运行在端口 3000');
    console.log('http://localhost:3000');
});
