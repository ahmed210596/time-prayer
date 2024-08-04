import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';


export default  function MediaCard({ name, time, image }) {
    

  return (
    <Card sx={{ width: "14vw" }}>
      <CardMedia
       sx={{ height: 140 }}
       image={image}
       title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h2" component="div">
         {name}
        </Typography>
        <Typography variant="h1" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}


