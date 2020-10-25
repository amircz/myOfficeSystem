app.factory('OfficeSystemDataFactory', ['$http', ($http) => {
    const jsonFileHttpResponse = $http.get('Data.json');
    let orders = [], products = [], customers = [], statuses = [];
    jsonFileHttpResponse.then((response) => {
        orders = response.data.orders;
        products = response.data.products;
        customers = response.data.customers;
        statuses = response.data.statuses;
    });
    let functionsObject = {};
    functionsObject.getData = () => $http.get('Data.json');
    functionsObject.getOrderById = (orderId) => orders.find(order => order.id === orderId);
    functionsObject.getProductById = (prodId) => products.find(product => product.id === prodId);
    functionsObject.getCustomerNameById = (customerId) => customers.find(customer => customer.id == customerId).name;
    functionsObject.getProductValueById = (id) => functionsObject.getProductById(id).value;
    functionsObject.getProductNameById = (id) => functionsObject.getProductById(id).name;
    functionsObject.getValueOfProductsArr = (arr) => {
        let sum = 0;
        arr.forEach((product) => sum += functionsObject.getProductValueById(product.id) * product.amount)
        return sum >= 0 ? Math.min(sum, 10000) : 0;
    };
    functionsObject.getOrderValueById = (id) => functionsObject.getValueOfProductsArr(functionsObject.getOrderById(id).products);
    functionsObject.getOrderProductsDescription = (orderId) => {
        const order = functionsObject.getOrderById(orderId);
        const detailsArr = order.products.map(product => functionsObject.getProductNameById(product.id) + ": " + product.amount + " ")
        return detailsArr;
    };

    functionsObject.addRow = (statusId, customerId) => {
        const newRowJson = {
            "id": orders[orders.length - 1].id + 1,
            "date": new Date().toLocaleDateString(),
            "customerId": customerId,
            "statusId": statusId,
            "products": []
        }
        orders.push(newRowJson);
        return orders;
    };
    functionsObject.deleteOrder = (orderId) => {
        const ORDER_INDEX = orders.map(order => order.id).indexOf(orderId);
        orders.splice(ORDER_INDEX, 1);
        return orders;
    };
    functionsObject.setOrderProductsById = (orderId, newProducts) => {
        orders[orders.map(order => order.id).indexOf(orderId)].products = newProducts;
    };
    functionsObject.getStatusNameById = (id) => statuses.find(status => status.id === id).name;
    functionsObject.getAllOrders = () => orders;
    functionsObject.getAllCustomers = () => customers;
    functionsObject.getAllProducts = () => products;
    functionsObject.getAllStatuses = () => statuses;
    functionsObject.updateOrderDetailsInDB = (updatedOrder) => {
        orders[(orders.map(curOrder => curOrder.id)).indexOf(updatedOrder.id)].date = updatedOrder.date;
        orders[(orders.map(curOrder => curOrder.id)).indexOf(updatedOrder.id)].statusId = updatedOrder.statusId;
    }
    functionsObject.getOrderDetailsForTable = (id) => {
        const order = functionsObject.getOrderById(id);
        const orderDetails = [order.id, order.date, functionsObject.getStatusNameById(order.statusId),
            functionsObject.getCustomerNameById(order.customerId), functionsObject.getOrderValueById(order.id)];
        return orderDetails;
    }
    functionsObject.getOrdersDetailsForTable = () => orders.map(order => functionsObject.getOrderDetailsForTable(order.id));

    return functionsObject;
}]);

