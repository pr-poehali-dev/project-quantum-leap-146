import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Мгновенный расчёт стоимости",
    description: "Укажите адрес откуда и куда, тип груза — и получите точную цену за секунды. Никакого ожидания и созвонов.",
    icon: "zap",
    badge: "Быстро",
  },
  {
    title: "Автомобили любого класса",
    description: "Газели, фургоны, грузовики до 20 тонн. Выбирайте нужный тоннаж — подберём оптимальный вариант.",
    icon: "truck",
    badge: "Выбор",
  },
  {
    title: "Профессиональные грузчики",
    description: "Опытные грузчики с аккуратным обращением. Добавьте к заказу нужное количество — от 1 до 6 человек.",
    icon: "users",
    badge: "Надёжно",
  },
  {
    title: "Отслеживание в реальном времени",
    description: "Знайте, где находится ваш груз в каждый момент. GPS-трекинг и уведомления на каждом этапе.",
    icon: "map",
    badge: "GPS",
  },
  {
    title: "Страхование груза",
    description: "Каждая перевозка застрахована. Ваши вещи под защитой от момента погрузки до сдачи на точку.",
    icon: "shield",
    badge: "Защита",
  },
  {
    title: "Заказ в 3 клика",
    description: "Простая форма заказа без регистрации. Подтверждение — в течение 5 минут. Оплата онлайн или наличными.",
    icon: "check",
    badge: "Просто",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё для вашей перевозки</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Никаких посредников и скрытых доплат — только честная цена и надёжный сервис
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "zap" && "⚡"}
                    {feature.icon === "truck" && "🚛"}
                    {feature.icon === "users" && "👷"}
                    {feature.icon === "map" && "📍"}
                    {feature.icon === "shield" && "🛡️"}
                    {feature.icon === "check" && "✅"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}