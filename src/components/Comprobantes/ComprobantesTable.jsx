import { useState, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import UserContext from "../../context/userContext";
import apiFeco from "../../Services/apiServices";
import Loading from "../Loading/Loading";

export function formatoSaldo(saldo) {
    if (saldo) {
        const result = saldo.toLocaleString("es-ar", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        })
        return result
    }
    return '$' + 0
}

const Columns = [
    /* {
        name: 'Tipo de doc',
        selector: row => row.TIPODOC,
        wrap: true,
        grow: 0.2
    }, */
    {
        name: 'Detalle Comprobante',
        selector: row => row.DESCRIPCIONDOC,
        center: true,
        wrap: true
    },
    /* {
        name: 'N° Recibos',
        selector: row => row.NRORECIBO,
        center: true,
        grow: 1.5
    }, */
    {
        name: 'Fecha Comprobante',
        selector: row => row.FECHA,
        center: true,
        sortable: true,
        format: (row) => {
            return dayjs(row.FECHA).format('DD/MM/YYYY')
        }
    },
    {
        name: 'N° Comprobante',
        selector: row => row.NROCOMPROBANTE,
        center: true
    },
    {
        name: 'Cuota',
        selector: row => row.CANTCUOTA,
        center: true,
        grow: 0.2,
        format: (row) => {
            return Number(row.CANTCUOTA)
        }
    },
    {
        name: 'Fecha Vencimiento',
        selector: row => row.FECHAVENCIMIENTO,
        center: true,
        sortable: true,
        format: (row) => {
            return dayjs(row.FECHAVENCIMIENTO).format('DD/MM/YYYY')
        }
    },
    {
        name: 'Importe Comprobante',
        selector: row => row.IMPORTECOMPROBANTE,
        right: true,
        format: (row) => {
            const Comprobante = row.IMPORTECOMPROBANTE / 100
            return formatoSaldo(Comprobante)
        }
    },
    {
        name: 'Importe Pendiente',
        selector: row => row.IMPORTEPENDIENTE,
        right: true,
        format: (row) => {
            const Pendiente = row.IMPORTEPENDIENTE / 100
            return formatoSaldo(Pendiente)
        }
    },
    /* {
        name: 'Saldo',
        center: true,
        cell: (row) => {
            return <Print
                style={{ color: '#B621D0', cursor: 'pointer' }}
                onClick={handlePrint}
            />
        }
    } */
]

const ColumnsDiscounts = [
    {
        name: 'Mes',
        selector: row => row.month,
        center: true,
        format: (row) => {
            const uppercaseMonth = row.month.toUpperCase()
            return uppercaseMonth
        }
    },
    {
        name: 'Importe',
        selector: row => row.amount,
        center: true,
        format: (row) => {
            const Comprobante = row.amount / 100
            return formatoSaldo(Comprobante)
        }
    }
]

export default function ComprobantesTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [dataDiscountsTable, setDataDiscountsTable] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (Object.keys(user).length) {
            handleVouchers()
        }
    }, [user])

    async function handleVouchers() {
        const { data: vouchers } = await apiFeco.post('vouchers', { AN8: user.USAN8 })
        if (vouchers.data) {
            setDataTable(vouchers.data)
            nextDiscounts(vouchers.data)
        }
        setLoading(false)
    }

    function nextDiscounts(vouchers) {
        const months = {
            enero: '01',
            febrero: '02',
            marzo: '03',
            abril: '04',
            mayo: '05',
            junio: '06',
            julio: '07',
            agoston: '08',
            septimebre: '09',
            octubre: '10',
            noviembre: '11',
            diciembre: '12',
        }
        let valuesMonths = {
            enero: 0,
            febrero: 0,
            marzo: 0,
            abril: 0,
            mayo: 0,
            junio: 0,
            julio: 0,
            agosto: 0,
            septimebre: 0,
            octubre: 0,
            noviembre: 0,
            diciembre: 0
        }
        vouchers.forEach(voucher => {
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2022-12-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-01-25').format('MM-DD')) {
                valuesMonths.enero += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-01-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-02-25').format('MM-DD')) {
                valuesMonths.febrero += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-02-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-03-25').format('MM-DD')) {
                valuesMonths.marzo += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-03-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-04-25').format('MM-DD')) {
                valuesMonths.abril += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-04-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-05-25').format('MM-DD')) {
                valuesMonths.mayo += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-05-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-06-25').format('MM-DD')) {
                valuesMonths.junio += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-06-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-07-25').format('MM-DD')) {
                valuesMonths.julio += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-07-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-08-25').format('MM-DD')) {
                valuesMonths.agosto += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-08-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-09-25').format('MM-DD')) {
                valuesMonths.septimebre += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-09-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-10-25').format('MM-DD')) {
                valuesMonths.octubre += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-10-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-11-25').format('MM-DD')) {
                valuesMonths.noviembre += voucher.IMPORTEPENDIENTE
            }
            if (dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') >= dayjs('2023-11-26').format('MM-DD')
                && dayjs(voucher.FECHAVENCIMIENTO).format('MM-DD') <= dayjs('2023-12-25').format('MM-DD')) {
                valuesMonths.diciembre += voucher.IMPORTEPENDIENTE
            }
        })
        let discounts = []
        Object.entries(valuesMonths).forEach(value => {
            if (value[1] !== 0) {
                discounts.push(
                    {
                        month: value[0],
                        amount: value[1]
                    }
                )
            }
        })
        setDataDiscountsTable(discounts)
    }

    const noData = <strong style={{ color: 'red' }}>No hay comprobantes vigentes</strong>

    return (
        <>
            <div>
                <h4>Comprobantes</h4>
                <DataTable
                    data={dataTable}
                    columns={Columns}
                    progressPending={loading}
                    progressComponent={<Loading marginLeft={20} />}
                    noDataComponent={noData}
                />
            </div>
            <div>
                <h4>Próximos descuentos</h4>
                <DataTable
                    data={dataDiscountsTable}
                    columns={ColumnsDiscounts}
                    progressPending={loading}
                    progressComponent={<Loading marginLeft={20} />}
                    noDataComponent={noData}
                />
            </div>
            <style jsx>{`
                div{
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 50px 20px 10px 20px;
                    box-shadow: 1px 2px 1px grey;
                }
                h4{
                    padding: 10px;
                    margin: 0;
                }

                @media screen and (max-width: 650px){
                    div{
                        margin: 30px 5px 10px 5px;
                    }
                }
                `}</style>
        </>
    )
}
