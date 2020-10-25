function ModalController($rootScope,$uibModal) {
    var $scope = this;
    $scope.items = [];
    $scope.order=$scope.items[0];
    const MODAL_TEMPLATES_URLS = {
        'orderModal': '/templates/OrderModal.html',
        'setProductsOfOrderModal': '/templates/setProductsOfOrderModal.html'
    }

    $scope.open = function (modalItems, size, modalType) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: MODAL_TEMPLATES_URLS[modalType],
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            resolve: {
                items: function () {
                    return modalItems;
                }
            }
        });

    };
    $rootScope.$on("openModal",(event,ModalItems,size,type)=>{
        $scope.open(ModalItems,size,type);
    })

}