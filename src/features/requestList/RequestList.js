import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'antd';

import { useHttp } from './requestListAPI';
import { fetchRequestList, selectAll, requestItemUpdated } from './requestListSlice';
import { fetchAddresses } from './addressesSlice';
import { locationChanged } from '../requestMap/requestMapSlice';
import { EditableRow, EditableCell } from './Editable';

import 'antd/dist/antd.min.css';

const RequestList = (props) => {

    const [selected, setSelected] = useState(null);
    const { request } = useHttp();
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.addresses.addresses);
    const requestList = useSelector(selectAll);

    useEffect(() => {
        dispatch(fetchRequestList());
        dispatch(fetchAddresses());
    }, []);

    const defaultColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Dispatch address',
            dataIndex: 'dispatchAddress',
            key: 'dispatchAddress',
            editable: true,
        },
        {
            title: 'Shipping address',
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
            editable: true,
        },
    ];

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
    
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const handleSave = (row, changes) => {
        const addressType = changes ? Object.keys(changes)[0] : null;
        if (!addressType || row[addressType] === changes[addressType]) {
            return;
        }

        const selectedAddress = changes[addressType];
        const selectedLocation = addresses.filter((item) => item.address === selectedAddress);
        if (selectAll.length === 0) {
            console.log('Выбранный адрес не найден.')
            return;
        }

        request(`http://localhost:3001/requests/${row.id}`, 'PUT', JSON.stringify({...row, ...changes}))
            .then(res => console.log(res, 'Адрес обновлён'))
            .then(dispatch(requestItemUpdated({id: row.id, changes: changes})))
            .catch((err) => console.log(err))

        if (selected) {
            dispatch(locationChanged({[addressType]: selectedLocation[0].coords}))
        }
    };

    const onChange = (selectedRowKey, selectedRows) => {
        if (selectedRows.length > 0) {
            const record = selectedRows[0];
            const dispatchAddress = addresses.filter((item) => item.address === record.dispatchAddress);
            const shippingAddress = addresses.filter((item) => item.address === record.shippingAddress);

            dispatch(locationChanged({
                dispatchAddress: dispatchAddress.length > 0 ? dispatchAddress[0].coords : [],
                shippingAddress: shippingAddress.length > 0 ? shippingAddress[0].coords : []
            }));

            setSelected(selectedRowKey);
        }
    }

    return (
        <>
            {requestList && requestList.length > 0 ?
                <Table
                    components={components}
                    dataSource={requestList}
                    columns={columns}
                    rowSelection={{
                        type: "radio",
                        onChange: onChange
                    }}
                />
                : null}
        </>
    );
}

export default RequestList;