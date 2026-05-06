import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Как рассчитывается стоимость перевозки?",
      answer:
        "Цена формируется из трёх составляющих: базовый тариф за автомобиль, километраж маршрута и стоимость грузчиков (по часам). Всё это отображается в калькуляторе прозрачно, до подтверждения заказа. Никаких скрытых доплат.",
    },
    {
      question: "Через сколько приедет машина?",
      answer:
        "Минимальное время подачи — 1 час. Если нужно срочно, уточните при заказе — постараемся найти ближайшую свободную машину. Также можно запланировать перевозку на удобное время.",
    },
    {
      question: "Нужна ли регистрация для заказа?",
      answer:
        "Нет, заказать можно без регистрации — просто заполните форму и укажите телефон для подтверждения. Регистрация нужна только для сохранения истории заказов и бонусной программы.",
    },
    {
      question: "Вы работаете с юридическими лицами?",
      answer:
        "Да, оформляем полный пакет документов: договор, акт выполненных работ, счёт-фактура. Работаем с НДС и без. Для постоянных корпоративных клиентов — специальные условия и персональный менеджер.",
    },
    {
      question: "Что если груз повредится при перевозке?",
      answer:
        "Каждая перевозка застрахована. В случае повреждения составляем акт на месте, и страховая компания возмещает ущерб в течение 10 рабочих дней. Грузчики несут материальную ответственность.",
    },
    {
      question: "Какие грузы вы перевозите?",
      answer:
        "Бытовые вещи и мебель, строительные материалы, оборудование, технику, продукты питания. Не перевозим опасные, взрывоопасные и незаконные грузы. При сомнениях — уточните у оператора.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на популярные вопросы о заказе, оплате и условиях перевозки.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
