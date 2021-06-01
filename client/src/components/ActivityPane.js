import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import '../css/activity.css';

export default function ActivityPane(props)
{
    const 
    {
        title,
        desc,
        link,
    }=props;

    return<div className="activity-panel">
        <div className="activity-title">
        <h1>{title}</h1>
        </div>
        <div className="activity-desc">
        <h4>{desc}</h4>
        </div>
        <Button
        variant="outlined"
        id="activity-btn"
        onClick={()=>{
            window.open(link,'_self');
        }}
        >
            Enter
        </Button>
    </div>
}