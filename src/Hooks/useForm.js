import { useState, useContext, useEffect, useMemo } from "react"
import dayjs from "dayjs"
import UserContext from "../context/userContext"

export default function useForm() {
    const { user } = useContext(UserContext)
    const [noDataError, setNoDataError] = useState('')
    const [userData, setUserData] = useState({
        name: '',
        subName: '',
        legajo: user.USNROLEG || ''/* user.USNROLEG */,
        date: `${dayjs().format('YYYY-MM-DD')}`,
        destination: '',
        exitPlace: '',
        arrivalPlace: '',
        dateExit: '',
        dateArrival: '',
        land: false,
        aerial: false,
        maritime: false,
        detail: ''
    })
    const [arrayExpenses, setArrayExpenses] = useState([])
    const [expenses, setExpenses] = useState({
        id: arrayExpenses.length,
        date: '',
        boolVoucher: '',
        voucher: '',
        detail: '',
        pay: '',
        type: '',
        coin: '',
        amount: ''
    })

    useEffect(() => {
        if (expenses.boolVoucher === '0' && expenses.voucher) {
            setExpenses({ ...expenses, voucher: '' })
        }
    }, [expenses])

    useEffect(() => {
        setExpenses({
            ...expenses,
            id: arrayExpenses.length + 1
        })
    }, [arrayExpenses])

    function handleChangeForm(e) {
        const { value, name } = e.target
        setUserData({ ...userData, [name]: value })
    }

    function handleCheck(e) {
        const { checked, name } = e.target
        setUserData({ ...userData, [name]: checked ? 1 : 0 })
    }

    function handleChangeCost(e) {
        const { value, name } = e.target
        setExpenses({ ...expenses, [name]: value })
    }

    function handleAddExpenses() {
        const expensesValues = [expenses.date, expenses.pay, expenses.type, expenses.boolVoucher, expenses.coin, expenses.amount]
        if (expensesValues.includes('')) {
            setNoDataError('Debe completar todos los campos')
            return
        }
        setArrayExpenses([...arrayExpenses, expenses])
        const newId = expenses.id + 1
        setExpenses({
            id: newId,
            date: '',
            boolVoucher: '',
            voucher: '',
            detail: '',
            pay: '',
            type: '',
            coin: '',
            amount: ''
        })
        setNoDataError('')
    }

    function handleFilterExpenses(id) {
        const arrayFilter = arrayExpenses.filter(expense => expense.id !== id)
        setArrayExpenses(arrayFilter)
    }

    const fullValueArs = useMemo(() => {
        let sumValues = 0
        arrayExpenses.forEach(expense => {
            if (expense.coin == '0') {
                sumValues += Number(expense.amount)
            }
        })
        return sumValues
    }, [arrayExpenses])

    const fullValueUsd = useMemo(() => {
        let sumValues = 0
        arrayExpenses.forEach(expense => {
            if (expense.coin == '1') {
                sumValues += Number(expense.amount)
            }
        })
        return sumValues
    }, [arrayExpenses])

    return {
        handleChangeForm,
        handleCheck,
        handleChangeCost,
        handleAddExpenses,
        handleFilterExpenses,
        noDataError,
        userData,
        setUserData,
        arrayExpenses,
        setArrayExpenses,
        expenses,
        fullValueArs,
        fullValueUsd
    }
}
