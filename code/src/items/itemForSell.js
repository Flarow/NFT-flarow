import React from 'react'
import { Button, Card, Icon, Image, Statistic } from 'semantic-ui-react'

//props needed: itemid imageurl name description price timelimit
const itemCardForSell = (props) => (
    <Card>
        <div style="border: 1px solid #ccc!important;
        padding: 14px;
        border-radius: 16px!important;
        width:100%;height:228px">
            <div style="bodrder:0px;padding:0px;width:30%;height:200px;float:left" >
                <Image src={props.imageurl} />
            </div>
            <div style="padding:5px;width:68%;height:200px;float:right">
                <p><b>名称:</b>{props.name}</p><br/>
                <p><b>描述:</b>{props.desc}</p><br/>
                <p><b>现价:</b>{props.price}</p><br/>
                <p>将结束于 {date(props.timelimit).toLocaleString()}</p><br/>
                <Button color='red' onClick={props.bid} disabled={props.isClicked}>
                    <Button.Content visible>竞拍</Button.Content>
                </Button>
            </div>
        </div>
    </Card>
)

export default itemCardForSell