function ModalInstanceController(OfficeSystemDataFactory, $uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.order = OfficeSystemDataFactory.getOrderById(items[0]);
    OfficeSystemDataFactory.getStatusNameById($ctrl.order.statusId);
    $ctrl.orderStatusName = OfficeSystemDataFactory.getStatusNameById($ctrl.order.statusId);
    $ctrl.orderProducts = OfficeSystemDataFactory.getOrderProductsDescription($ctrl.order.id);
    $ctrl.orderCustomerName = OfficeSystemDataFactory.getCustomerNameById($ctrl.order.customerId);
    $ctrl.orderValue = OfficeSystemDataFactory.getOrderValueById($ctrl.order.id);
    $ctrl.allProducts = OfficeSystemDataFactory.getAllProducts();
    $ctrl.allCustomers = OfficeSystemDataFactory.getAllCustomers();
    $ctrl.dateIsOnEdit = false;
    $ctrl.statusIsOnEdit = false;
    $ctrl.customerIsOnEdit = false;
    $ctrl.editableOrderDate = new Date($ctrl.order.date);
    $ctrl.allStatuses = OfficeSystemDataFactory.getAllStatuses();
    $ctrl.selectedStatusId = $ctrl.order.statusId;
    $ctrl.selectedCustomerId = $ctrl.order.customerId;
    $ctrl.updateTableFunction = items[1];
    $ctrl.orderDateObject = new Date($ctrl.order.date);
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $ctrl.getAmountOfProductInOrderById = (productId) => {
        const optionalProduct = $ctrl.order.products.find(product => product.id === productId);
        return optionalProduct != undefined ? optionalProduct.amount : 0;
    }
    $ctrl.orderProductsAmountArr = $ctrl.allProducts.map(product => $ctrl.getAmountOfProductInOrderById(product.id));

    $ctrl.cancelProductsUpdate = () => $ctrl.cancel();
    $ctrl.setProductsOfOrder = () => {
        const newProductsArr = [];
        for (let i = 0; i < $ctrl.orderProductsAmountArr.length; i++) {
            if ($ctrl.orderProductsAmountArr[i] != 0) {
                newProductsArr.push({"id": i + 1, "amount": $ctrl.orderProductsAmountArr[i]})
            }
        }
        OfficeSystemDataFactory.setOrderProductsById($ctrl.order.id, newProductsArr);
        $ctrl.cancel();
    }
    $ctrl.setValuesToIsOnEditVars = (dateIsOnEditValue, statusIsOnEditValue, customerIsOnEditValue) => {
        $ctrl.dateIsOnEdit = dateIsOnEditValue;
        $ctrl.statusIsOnEdit = statusIsOnEditValue;
        $ctrl.customerIsOnEdit = customerIsOnEditValue;
    }

    $ctrl.handleClickEditable = (type, $event) => {
        $event.stopPropagation();
        if (type === 'd') {
            $ctrl.setValuesToIsOnEditVars(true, false, false);
        } else if (type === 's') {
            $ctrl.setValuesToIsOnEditVars(false, true, false);
        } else if (type === 'c') {
            $ctrl.setValuesToIsOnEditVars(false, false, true);
        }
    }

    $ctrl.applyOrderChanges = () => {
        $ctrl.order.date = $ctrl.orderDateObject.toLocaleDateString();
        $ctrl.order.statusId = parseInt($ctrl.selectedStatusId);
        $ctrl.order.customerId = parseInt($ctrl.selectedCustomerId);
        OfficeSystemDataFactory.updateOrderDetailsInDB($ctrl.order);
        $ctrl.setValuesToIsOnEditVars(false, false, false);
    }
    $ctrl.cancelEdit = () => {
        $ctrl.setValuesToIsOnEditVars(false, false, false);
    }
}