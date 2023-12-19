import OrdersTable from './ordersTable.vue'
import DocsRegistryLink from './docsRegistryLink.vue'
import OrderDocsListForm from './orderDocs/orderDocsForm.vue'
import OrderDocsList from './orderDocs/orderDocsList.vue'
import OrderPaymentParts from './paymentParts/orderPaymentParts.vue'
import PaymentInvoiceLinks from './paymentInvoiceLinks.vue'
import OrdersTableSettings from './ordersTableSettings/ordersTableSettings.vue'
import ReqTransport from './reqTransport.vue'
import BlockTitle from './blockTitle/blockTitle.vue'
import CargoParams from './cargoParams.vue'
import ClientBlock from './clientBlock/clientBlock.vue'
import { OrderModel } from './model/orderModel.js'
import { useOrderDocs } from './orderDocs/model/useOrderDocs.js'

export {
  OrdersTable,
  DocsRegistryLink,
  OrderDocsListForm,
  useOrderDocs,
  OrderPaymentParts,
  PaymentInvoiceLinks,
  OrderDocsList,
  OrdersTableSettings,
  ReqTransport,
  BlockTitle,
  ClientBlock,
  CargoParams,
  OrderModel,
}
