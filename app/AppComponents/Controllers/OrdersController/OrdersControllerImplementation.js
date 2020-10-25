function OrdersController($scope, $rootScope, $http, OfficeSystemDataFactory, ModalCtrl) {
    const DISABLED_BUTTON_CLASSNAME = "blackBtn";
    const ACTIVATED_BUTTON_CLASSNAME = "redBtn";
    const MAX_ROWS_EACH_PAGE = 5;
    let currentPage = 0;
    $scope.isNewRowDetailsShow = false;
    $scope.plusBtnClassName = DISABLED_BUTTON_CLASSNAME;
    $scope.orders = [];
    $scope.customers = [];
    $scope.products = [];
    $scope.statuses = [];
    $scope.ordersDetailsForTable = [];
    OfficeSystemDataFactory.getData().then(function (response) {
        $scope.orders = response.data.orders;
        $scope.customers = response.data.customers;
        $scope.products = response.data.products;
        $scope.statuses = response.data.statuses;
        $scope.allStatusesNames = $scope.statuses.map(status => status.name);
        $scope.allCustomersNames = $scope.customers.map(customer => customer.name);
        $scope.allStatusesIds = $scope.statuses.map(status => status.id);
        $scope.allCustomersIds = $scope.customers.map(customer => customer.id);
        $scope.ordersDetailsForTable = OfficeSystemDataFactory.getOrdersDetailsForTable();
    });
    $scope.currentDate = "יעודכן בהוספה"
    $scope.newRowValue = 0;
    $scope.selectedStatusId = "1";
    $scope.selectedCustomerId = "1";
    $scope.newRowBtnTxt = "+";
    const toggleIsNewRowDetailsShow = () => {
        if ($scope.plusBtnClassName === DISABLED_BUTTON_CLASSNAME) {
            $scope.plusBtnClassName = ACTIVATED_BUTTON_CLASSNAME;
            $scope.newRowBtnTxt = "-";
        } else {
            $scope.plusBtnClassName = DISABLED_BUTTON_CLASSNAME;
            $scope.newRowBtnTxt = "+";
        }
        $scope.isNewRowDetailsShow = !$scope.isNewRowDetailsShow;
    }

    $scope.onClickPlus = () => {
        goToLastPage();
        toggleIsNewRowDetailsShow();
    }
    $scope.isOrderInCurrentPageFilter = (order) => {
        const ORDER_INDEX = $scope.getOrderIndex(order);
        return (ORDER_INDEX < MAX_ROWS_EACH_PAGE * (currentPage + 1)) && (ORDER_INDEX >= MAX_ROWS_EACH_PAGE * currentPage);

    }

    $scope.createPagesNumberArrayForRepeat = () => {
        const pagesNumberArr = [];
        for (let pageNumber = 0; pageNumber < ($scope.orders.length / MAX_ROWS_EACH_PAGE); pageNumber++) {
            pagesNumberArr[pageNumber] = pageNumber;
        }
        return pagesNumberArr;
    }
    const updatePage = () => {
        const lastPage = Math.floor($scope.orders.length / MAX_ROWS_EACH_PAGE);
        if ((currentPage === lastPage) && ($scope.orders.length % MAX_ROWS_EACH_PAGE === 0) && (currentPage > 0)) {
            $scope.setCurrentPage(currentPage - 1);
        }
    }
    $scope.deleteOrder = (orderId, $event) => {
        $event.stopPropagation();
        $scope.orders = OfficeSystemDataFactory.deleteOrder(orderId);
        $scope.ordersDetailsForTable = OfficeSystemDataFactory.getOrdersDetailsForTable();
        updatePage();
    }

    const getCustomerNameById = (customerId) => OfficeSystemDataFactory.getCustomerNameById(customerId);

    const getOrderValueById = (id) => OfficeSystemDataFactory.getOrderValueById(id);

    $scope.setCurrentPage = (newPage) => {
        const LAST_PAGE = Math.floor($scope.orders.length / MAX_ROWS_EACH_PAGE);
        currentPage = newPage;
        if (newPage != LAST_PAGE && $scope.isNewRowDetailsShow) {
            toggleIsNewRowDetailsShow()
        }
    }

    const goToLastPage = () => {
        currentPage = Math.floor($scope.orders.length / MAX_ROWS_EACH_PAGE);
        console.log("")
    };

    $scope.openOrderModal = (order) => {
        $rootScope.$emit("openModal", [order.id, updateTable], 'sm', 'orderModal');
    }
    const updateTable = () => {
        $scope.ordersDetailsForTable = OfficeSystemDataFactory.getOrdersDetailsForTable();
    }
    $scope.handleAddingRow = (productsModalOpeningFunction) => {
        $scope.orders = OfficeSystemDataFactory.addRow(parseInt($scope.selectedStatusId), parseInt($scope.selectedCustomerId));
        productsModalOpeningFunction([$scope.orders[$scope.orders.length - 1].id, updateTable],
            'sm', 'setProductsOfOrderModal', 'sm', 'orderModal');
        toggleIsNewRowDetailsShow();
        $scope.ordersDetailsForTable = OfficeSystemDataFactory.getOrdersDetailsForTable();
    }
    $scope.openSetOrderProductsModal = (order, $event) => {
        $event.stopPropagation();
        $rootScope.$emit("openModal", [order.id, updateTable], 'sm', 'setProductsOfOrderModal');
    }

    $scope.getOrderDetailsForTable = (order) => [order.id, order.date, OfficeSystemDataFactory.getStatusNameById(order.statusId), getCustomerNameById(order.customerId), getOrderValueById(order.id)];

    const defaultComparator = (firstNum, secondNum) => firstNum >= secondNum ? 1 : -1;
    const datesComparator = (dateOne, dateTwo) => {
        const splittedDateOne = dateOne.value.split("/");
        const splittedDateTwo = dateTwo.value.split("/");
        return (splittedDateOne[2] > splittedDateTwo[2] ? 1 : splittedDateOne[2] < splittedDateTwo[2] ? -1
                : splittedDateOne[1] > splittedDateTwo[1] ? 1 : splittedDateOne[1] < splittedDateTwo[1] ? -1
                    : splittedDateOne[0] > splittedDateTwo[0] ? 1 : splittedDateOne[0] < splittedDateTwo[0] ? -1 : 1
        )
    }

    const orderValueComparator = (firstOrderId, secondOrderId) => getOrderValueById(firstOrderId.value) >= getOrderValueById(secondOrderId.value) ? 1 : -1;
    $scope.BY_ID_SORT = "byId";
    const BY_ID_PARAMETER = "id";
    $scope.BY_DATE_SORT = "byDate";
    const BY_DATE_PARAMETER = "date";
    $scope.BY_VALUE_SORT = "byValue";

    $scope.selectedOrderOption = $scope.BY_ID_SORT
    $scope.orderByParameter = BY_ID_PARAMETER;
    $scope.selectedComparator = defaultComparator;
    $scope.updateOrder = () => {
        if ($scope.selectedOrderOption === $scope.BY_ID_SORT) {
            $scope.orderByParameter = BY_ID_PARAMETER;
            $scope.selectedComparator = defaultComparator;
        } else if ($scope.selectedOrderOption === $scope.BY_DATE_SORT) {
            $scope.orderByParameter = BY_DATE_PARAMETER;
            $scope.selectedComparator = datesComparator;
        } else if ($scope.selectedOrderOption === $scope.BY_VALUE_SORT) {
            $scope.orderByParameter = BY_ID_PARAMETER;
            $scope.selectedComparator = orderValueComparator;
        }
    }
    $scope.filteredStatusId = undefined;
    $scope.filteredCustomerName = undefined;
    $scope.selectedFilterOption = undefined;
    $scope.selectedFilter = undefined;
    const statusFilter = (order) => order.statusId === parseInt($scope.filteredStatusId) || $scope.filteredStatusId == "";
    const customerNameFilter = (order) => OfficeSystemDataFactory.getCustomerNameById(order.customerId) === $scope.filteredCustomerName
        || $scope.filteredCustomerName == "";
    $scope.updateFilter = () => {
        if ($scope.selectedFilterOption === "status") {
            $scope.selectedFilter = statusFilter;
            if ($scope.filteredCustomerName != "") {
                $scope.filteredCustomerName = "";
            }
        } else {
            $scope.selectedFilter = customerNameFilter;
            $scope.filteredStatusId = undefined;
        }
    }
    $scope.getOrderIndex = (order) => $scope.orders.indexOf(order);
}
