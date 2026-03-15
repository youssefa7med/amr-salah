import React from 'react'
import { useTranslation } from 'react-i18next'

interface ReceiptItem {
  name: string
  price: number
}

interface ReceiptProps {
  clientName: string
  clientPhone?: string
  visitNumber: number
  date: string
  time?: string
  items: ReceiptItem[]
  subtotal: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  paymentMethod: string
  barber?: string
  isVIP?: boolean
  barbershopName?: string
  barbershopPhone?: string
}

export const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptProps>(
  (
    {
      clientName,
      clientPhone,
      visitNumber,
      date,
      time,
      items,
      subtotal,
      discount,
      discountType,
      total,
      paymentMethod,
      barber,
      isVIP,
      barbershopName = '💈 محل الحلاقة',
      barbershopPhone,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const formatPaymentMethod = (method: string) => {
      const methods: Record<string, string> = {
        cash: t('pos.cash'),
        card: t('pos.card'),
        wallet: t('pos.wallet'),
      }
      return methods[method] || method
    }

    return (
      <div ref={ref} className="receipt no-print">
        <div className="receipt-title mb-4">
          <p className="font-semibold text-lg">{barbershopName}</p>
          {barbershopPhone && (
            <p className="text-xs text-gray-500 mb-1">📱 {barbershopPhone}</p>
          )}
          <p className="text-xs text-gray-600">محل حلاقة متخصص</p>
        </div>

        <div className="receipt-divider"></div>

        {/* Client Info */}
        <div className="receipt-row mb-2">
          <span className="font-semibold">{t('pos.receipt')}</span>
        </div>
        <div className="receipt-row text-xs">
          <span>{t('common.name')}:</span>
          <span>{clientName}</span>
        </div>
        {clientPhone && (
          <div className="receipt-row text-xs">
            <span>{t('common.phone')}:</span>
            <span>{clientPhone}</span>
          </div>
        )}
        <div className="receipt-row text-xs">
          <span>{t('pos.visit_number')}:</span>
          <span>{visitNumber}</span>
        </div>

        <div className="receipt-divider"></div>

        {/* Items */}
        <div className="space-y-1 mb-2">
          {items.map((item, idx) => (
            <div key={idx} className="receipt-row text-xs">
              <span>{item.name}</span>
              <span>{item.price} ج.م</span>
            </div>
          ))}
        </div>

        <div className="receipt-divider"></div>

        {/* Totals */}
        <div className="receipt-row text-xs mb-1">
          <span>{t('pos.subtotal')}:</span>
          <span>{subtotal.toFixed(2)} ج.م</span>
        </div>

        {discount > 0 && (
          <div className="receipt-row text-xs mb-1">
            <span>{t('pos.discount')}: {discountType === 'percentage' ? discount + '%' : discount.toFixed(2) + ' ج.م'}</span>
            <span>-{discount.toFixed(2)} ج.م</span>
          </div>
        )}

        <div className="receipt-divider"></div>

        {/* Grand Total */}
        <div className="receipt-total mb-2">
          <p className="text-lg">{total.toFixed(2)} ج.م</p>
        </div>

        <div className="receipt-divider"></div>

        {/* Payment Info */}
        <div className="receipt-row text-xs mb-1">
          <span>{t('pos.payment_method')}:</span>
          <span>{formatPaymentMethod(paymentMethod)}</span>
        </div>

        {barber && (
          <div className="receipt-row text-xs mb-1">
            <span>{t('pos.barber')}:</span>
            <span>{barber}</span>
          </div>
        )}

        <div className="receipt-row text-xs mb-1">
          <span>{t('common.date')}:</span>
          <span>{date}{time ? ` ${time}` : ''}</span>
        </div>

        {/* VIP Badge */}
        {isVIP && (
          <>
            <div className="receipt-divider"></div>
            <div className="text-center py-2">
              <p className="text-xs font-semibold text-gold-400">⭐ {t('receipt.vip_client')}</p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="receipt-divider"></div>
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold">شكراً {clientName}!</p>
          <p className="text-xs text-gray-600">نتشرف بزيارتك دايماً</p>
          <p className="text-xs text-gray-600 mt-2">🇪🇬 مصنوع بـ ❤️ لمحل الحلاقة</p>
        </div>
      </div>
    )
  }
)

ReceiptTemplate.displayName = 'ReceiptTemplate'
