import { supabase, Client, Service } from '../db/supabase'

export const seedSampleData = async () => {
  try {
    // Sample clients
    const sampleClients: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'أحمد محمد',
        phone: '01001234567',
        birthday: '1990-05-15',
        notes: 'عميل مميز، يفضل الحلاقة العصرية',
        totalVisits: 15,
        totalSpent: 450,
        isVIP: true,
        lastVisit: new Date().toISOString().split('T')[0],
      },
      {
        name: 'محمود علي',
        phone: '01012345678',
        birthday: '1995-08-20',
        notes: 'يفضل الخدمات السريعة',
        totalVisits: 8,
        totalSpent: 240,
        isVIP: false,
        lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        name: 'سارة إبراهيم',
        phone: '01023456789',
        birthday: '1992-03-10',
        notes: 'تفضل الخدمات الكاملة',
        totalVisits: 20,
        totalSpent: 600,
        isVIP: true,
        lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        name: 'علي حسن',
        phone: '01034567890',
        birthday: '1998-11-05',
        notes: '',
        totalVisits: 3,
        totalSpent: 90,
        isVIP: false,
        lastVisit: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        name: 'خالد أحمد',
        phone: '01045678901',
        birthday: '1988-07-22',
        notes: 'عميل قديم وموثوق',
        totalVisits: 25,
        totalSpent: 750,
        isVIP: true,
        lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ]

    // Sample services
    const sampleServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        nameAr: 'حلاقة شعر عادية',
        nameEn: 'Regular Haircut',
        price: 30,
        duration: 20,
        category: 'haircut',
        active: true,
      },
      {
        nameAr: 'حلاقة شعر فاخرة',
        nameEn: 'Premium Haircut',
        price: 50,
        duration: 30,
        category: 'haircut',
        active: true,
      },
      {
        nameAr: 'حلاقة لحية',
        nameEn: 'Beard Trim',
        price: 25,
        duration: 15,
        category: 'beard',
        active: true,
      },
      {
        nameAr: 'لحية وحلاقة شاملة',
        nameEn: 'Complete Beard & Hair',
        price: 60,
        duration: 35,
        category: 'beard',
        active: true,
      },
      {
        nameAr: 'عناية بالبشرة',
        nameEn: 'Facial Care',
        price: 40,
        duration: 25,
        category: 'skincare',
        active: true,
      },
      {
        nameAr: 'حلاقة أطفال',
        nameEn: "Kids Haircut",
        price: 20,
        duration: 15,
        category: 'kids',
        active: true,
      },
      {
        nameAr: 'باقة كاملة',
        nameEn: 'Complete Package',
        price: 100,
        duration: 50,
        category: 'packages',
        active: true,
      },
    ]

    // Check if data already exists
    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    if ((clientCount ?? 0) === 0) {
      // Insert clients
      for (const client of sampleClients) {
        await supabase.from('clients').insert({
          ...client,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      console.log('✅ Sample clients inserted')
    }

    const { count: serviceCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })

    if ((serviceCount ?? 0) === 0) {
      // Insert services
      for (const service of sampleServices) {
        await supabase.from('services').insert({
          ...service,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      console.log('✅ Sample services inserted')
    }

    // Insert sample settings
    const defaultSettings = [
      { key: 'barbershipName', value: 'محل حلاقة الملاك' },
      { key: 'barbershipNameEn', value: 'Angel Barbershop' },
      { key: 'barbershipPhone', value: '01012345678' },
      { key: 'language', value: 'ar' },
      { key: 'theme', value: 'dark' },
      { key: 'vipThreshold', value: { type: 'visits', value: 10 } },
    ]

    for (const setting of defaultSettings) {
      const { count } = await supabase
        .from('settings')
        .select('*', { count: 'exact', head: true })
        .eq('key', setting.key)

      if ((count ?? 0) === 0) {
        await supabase.from('settings').insert({
          ...setting,
          updatedAt: new Date().toISOString(),
        })
      }
    }

    console.log('✅ Sample data initialized successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}
