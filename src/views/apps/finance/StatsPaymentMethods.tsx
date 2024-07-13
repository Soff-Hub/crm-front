import React from 'react'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { formatCurrency } from 'src/@core/utils/format-currency'

type Props = {
    data: { data: number, name: string }[]
}

export default function StatsPaymentMethods({ data }: Props) {

    const props: any = {
        series: data.map(el => el.data),
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: data.map(el => el.name),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            title: {
                text: "To'lov turlari bo'yicha",
                style: {
                    fontSize: '20px',
                    fontWeight: 500,
                    opacity: 0.6
                }
            },
            tooltip: {
                y: {
                    formatter: (value: number) => `${formatCurrency(value)} so'm`
                }
            }
        },
    }
    return <div>
        <div id="chart-circle">
            <ReactApexcharts options={props.options} series={props.series} type="pie" width={380} />
        </div>
        <div id="html-dist"></div>
    </div>
}