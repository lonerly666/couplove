import Button from '@material-ui/core/Button';


export default function ActivityPane(props)
{
    const 
    {
        title,
        desc,
        link,
    }=props;


    return<div>
        <h1>{title}</h1>
        <p>{desc}</p>
        <Button
        onClick={()=>{
            window.open(link,'_self');
        }}
        >
            Enter
        </Button>
    </div>
}