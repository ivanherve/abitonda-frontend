import React from "react";
import { Card } from "react-bootstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";

export function Statistic() {
    const data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    };
    return (
        <div>
            <h1>Tableau de bord</h1>
            <Graph
                title="Nombre de connexion"
                data={data}
            />
            <hr />
            <Graph
                title="Nombre de téléchargement"
                data={data}
            />
        </div>
    )
}

function Graph(props) {
    let data = props.data;
    return (
        <Card style={{ width: '100%', height: '75vh' }}>
            <Card.Header>
                <h3>{props.title}</h3>
            </Card.Header>
            <Card.Body>
                <Line
                    data={data}
                    width={100}
                    height={250}
                    options={{ maintainAspectRatio: false }}
                />
            </Card.Body>
        </Card>
    )
}