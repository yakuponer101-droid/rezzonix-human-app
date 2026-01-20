import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';

// Vitamin deficiency data
const VITAMIN_RECOMMENDATIONS = {
  low_vitamin_d: {
    name: 'D Vitamini Eksikliği',
    symptoms: ['Kemik ağrıları', 'Kas zayıflığı', 'Yorgunluk', 'Depresyon'],
    dailyDose: '1000-2000 IU',
    foods: ['Yağlı balık (somon, ton)', 'Yumurta sarısı', 'Süt ürünleri', 'Güneş ışığı'],
    supplements: 'D3 formu tercih edilmelidir',
    risk: 'high',
  },
  low_vitamin_b12: {
    name: 'B12 Vitamini Eksikliği',
    symptoms: ['Uyuşma', 'Hafıza kaybı', 'Yorgunluk', 'Halsizlik'],
    dailyDose: '2.4 mcg',
    foods: ['Et', 'Balık', 'Süt', 'Yumurta', 'Tahıllar'],
    supplements: 'Metilkobalamin formu önerilir',
    risk: 'high',
  },
  low_vitamin_c: {
    name: 'C Vitamini Eksikliği',
    symptoms: ['Bağışıklık zayıflığı', 'Yara iyileşmesinde gecikme', 'Diş eti kanaması'],
    dailyDose: '75-90 mg',
    foods: ['Portakal', 'Kivi', 'Brokoli', 'Çilek', 'Biber'],
    supplements: 'Liposomal C vitamini',
    risk: 'medium',
  },
  low_iron: {
    name: 'Demir Eksikliği',
    symptoms: ['Anemi', 'Yorgunluk', 'Soluk cilt', 'Nefes darlığı', 'Baş dönmesi'],
    dailyDose: '8-18 mg',
    foods: ['Kırmızı et', 'Ispanak', 'Mercimek', 'Kabak çekirdeği'],
    supplements: 'Ferröz sülfat',
    risk: 'high',
  },
  low_magnesium: {
    name: 'Magnezyum Eksikliği',
    symptoms: ['Kas krampları', 'Yorgunluk', 'Kalp ritim bozukluğu'],
    dailyDose: '310-420 mg',
    foods: ['Kuruyemiş', 'Tam tahıllar', 'Yeşil yapraklı sebzeler', 'Siyah çikolata'],
    supplements: 'Magnezyum glisinат',
    risk: 'medium',
  },
  low_omega3: {
    name: 'Omega-3 Eksikliği',
    symptoms: ['Kuru cilt', 'Saç dökülmesi', 'Konsantrasyon zorluğu', 'Eklem ağrıları'],
    dailyDose: '250-500 mg EPA+DHA',
    foods: ['Yağlı balık', 'Keten tohumu', 'Ceviz', 'Chia tohumu'],
    supplements: 'Balık yağı (moleküler distile)',
    risk: 'medium',
  },
};

// Diet recommendations based on condition
const DIET_PLANS = {
  high_blood_sugar: {
    title: 'Kan Şekeri Yönetimi',
    avoid: ['Şeker', 'Beyaz ekmek', 'İşlenmiş gıdalar', 'Gazlı içecekler'],
    recommended: ['Tam tahıllar', 'Sebzeler', 'Baklagiller', 'Yağsız protein'],
    meals: [
      'Kahvaltı: Yulaf ezmesi + yaban mersini + ceviz',
      'Öğle: Izgara tavuk + quinoa + karışık salata',
      'Akşam: Fırında somon + buharda sebze + kahverengi pirinç',
    ],
  },
  high_cholesterol: {
    title: 'Kolesterol Kontrolü',
    avoid: ['Trans yağlar', 'Kızartmalar', 'İşlenmiş et', 'Tam yağlı süt'],
    recommended: ['Zeytinyağı', 'Yulaf', 'Yaban mersini', 'Fıstık', 'Somon'],
    meals: [
      'Kahvaltı: Yulaf + elma + tarçın',
      'Öğle: Mercimek çorbası + zeytinyağlı sebze',
      'Akşam: Izgara balık + avokado salata',
    ],
  },
  obesity: {
    title: 'Kilo Yönetimi',
    avoid: ['Hızlı yemek', 'Şeker', 'Atıştırmalıklar', 'Alkol'],
    recommended: ['Protein', 'Lif', 'Su', 'Yeşil sebzeler', 'Egzersiz'],
    meals: [
      'Kahvaltı: Omlet (2 yumurta) + ıspanak + domates',
      'Öğle: Izgara tavuk göğsü + brokoli + kinoa',
      'Akşam: Ton balığı salatası + zeytinyağı',
    ],
  },
};

export default function ComprehensiveReportScreen() {
  const router = useRouter();
  const { currentAnalysis } = useAppStore();

  if (!currentAnalysis) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.backgroundLight]}
          style={styles.gradient}
        >
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Analiz bulunamadı</Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Determine vitamin deficiencies based on results
  const vitaminDeficiencies = currentAnalysis.results
    .filter((r) => r.stress > 6)
    .map((r) => {
      // Map organs to vitamin deficiencies
      if (r.organ.includes('Kemik')) return 'low_vitamin_d';
      if (r.organ.includes('Beyin') || r.organ.includes('Sinir')) return 'low_vitamin_b12';
      if (r.organ.includes('Bağışıklık')) return 'low_vitamin_c';
      if (r.organ.includes('Kan')) return 'low_iron';
      if (r.organ.includes('Kas')) return 'low_magnesium';
      if (r.organ.includes('Kalp')) return 'low_omega3';
      return 'low_vitamin_c';
    })
    .filter((v, i, arr) => arr.indexOf(v) === i); // unique

  // Determine diet plan
  const needsDietPlan = currentAnalysis.results.some(
    (r) =>
      r.organ.includes('Şeker') ||
      r.organ.includes('Obezite') ||
      r.organ.includes('Lipid')
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Kapsamlı Rapor</Text>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Patient Summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="person-circle" size={48} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.patientName}>{currentAnalysis.patient_name}</Text>
                <Text style={styles.patientDetails}>
                  {currentAnalysis.patient_age} yaş • {new Date().toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Genel Skor</Text>
                <Text style={styles.scoreValue}>{currentAnalysis.overall_score}/100</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Durum</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    {
                      color:
                        currentAnalysis.band === 'Dengeli'
                          ? COLORS.success
                          : COLORS.warning,
                    },
                  ]}
                >
                  {currentAnalysis.band}
                </Text>
              </View>
            </View>
          </Card>

          {/* Critical Findings */}
          {currentAnalysis.results.some((r) => r.stress > 7) && (
            <Card style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning" size={32} color={COLORS.error} />
                <Text style={styles.alertTitle}>Kritik Bulgular</Text>
              </View>
              {currentAnalysis.results
                .filter((r) => r.stress > 7)
                .map((result, index) => (
                  <View key={index} style={styles.criticalItem}>
                    <View style={styles.criticalDot} />
                    <View style={styles.criticalContent}>
                      <Text style={styles.criticalOrgan}>{result.organ}</Text>
                      <Text style={styles.criticalNote}>
                        Stres seviyesi yüksek ({result.stress}/10). {result.note}
                      </Text>
                    </View>
                  </View>
                ))}
            </Card>
          )}

          {/* Vitamin Deficiencies */}
          {vitaminDeficiencies.length > 0 && (
            <Card style={styles.vitaminCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="fitness" size={28} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Vitamin & Mineral Önerileri</Text>
              </View>
              {vitaminDeficiencies.map((defKey, index) => {
                const def = VITAMIN_RECOMMENDATIONS[defKey as keyof typeof VITAMIN_RECOMMENDATIONS];
                if (!def) return null;
                return (
                  <View key={index} style={styles.vitaminItem}>
                    <View style={styles.vitaminHeader}>
                      <Text style={styles.vitaminName}>{def.name}</Text>
                      <View
                        style={[
                          styles.riskBadge,
                          {
                            backgroundColor:
                              def.risk === 'high'
                                ? `${COLORS.error}20`
                                : `${COLORS.warning}20`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.riskText,
                            { color: def.risk === 'high' ? COLORS.error : COLORS.warning },
                          ]}
                        >
                          {def.risk === 'high' ? 'Yüksek Risk' : 'Orta Risk'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.vitaminSection}>
                      <Text style={styles.vitaminLabel}>Semptomlar:</Text>
                      <Text style={styles.vitaminText}>{def.symptoms.join(', ')}</Text>
                    </View>

                    <View style={styles.vitaminSection}>
                      <Text style={styles.vitaminLabel}>Günlük Dozaj:</Text>
                      <Text style={styles.vitaminText}>{def.dailyDose}</Text>
                    </View>

                    <View style={styles.vitaminSection}>
                      <Text style={styles.vitaminLabel}>Besin Kaynakları:</Text>
                      <Text style={styles.vitaminText}>{def.foods.join(', ')}</Text>
                    </View>

                    <View style={styles.vitaminSection}>
                      <Text style={styles.vitaminLabel}>Takviye Önerisi:</Text>
                      <Text style={styles.vitaminText}>{def.supplements}</Text>
                    </View>
                  </View>
                );
              })}
            </Card>
          )}

          {/* Diet Recommendations */}
          {needsDietPlan && (
            <Card style={styles.dietCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="restaurant" size={28} color={COLORS.success} />
                <Text style={styles.sectionTitle}>Diyet Önerileri</Text>
              </View>
              {Object.entries(DIET_PLANS).map(([key, plan], index) => (
                <View key={index} style={styles.dietPlan}>
                  <Text style={styles.dietTitle}>{plan.title}</Text>

                  <View style={styles.dietSection}>
                    <Text style={styles.dietLabel}>
                      <Ionicons name="close-circle" size={16} color={COLORS.error} /> Kaçının:
                    </Text>
                    <Text style={styles.dietText}>{plan.avoid.join(', ')}</Text>
                  </View>

                  <View style={styles.dietSection}>
                    <Text style={styles.dietLabel}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.success} /> Tüketin:
                    </Text>
                    <Text style={styles.dietText}>{plan.recommended.join(', ')}</Text>
                  </View>

                  <View style={styles.dietSection}>
                    <Text style={styles.dietLabel}>Örnek Menü:</Text>
                    {plan.meals.map((meal, i) => (
                      <Text key={i} style={styles.mealText}>
                        • {meal}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Lifestyle Recommendations */}
          <Card style={styles.lifestyleCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={28} color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>Yaşam Tarzı Önerileri</Text>
            </View>
            <View style={styles.recommendationItem}>
              <Ionicons name="walk" size={24} color={COLORS.primary} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Düzenli Egzersiz</Text>
                <Text style={styles.recommendationText}>
                  Haftada 5 gün, 30 dakika tempolu yürüyüş veya hafif koşu
                </Text>
              </View>
            </View>

            <View style={styles.recommendationItem}>
              <Ionicons name="moon" size={24} color={COLORS.primary} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Uyku Düzeni</Text>
                <Text style={styles.recommendationText}>
                  Günde 7-8 saat kaliteli uyku, düzenli uyku saatleri
                </Text>
              </View>
            </View>

            <View style={styles.recommendationItem}>
              <Ionicons name="water" size={24} color={COLORS.primary} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Su Tüketimi</Text>
                <Text style={styles.recommendationText}>
                  Günde en az 2-3 litre su içilmeli
                </Text>
              </View>
            </View>

            <View style={styles.recommendationItem}>
              <Ionicons name="leaf" size={24} color={COLORS.primary} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Stres Yönetimi</Text>
                <Text style={styles.recommendationText}>
                  Meditasyon, yoga, derin nefes egzersizleri
                </Text>
              </View>
            </View>
          </Card>

          {/* Follow-up Schedule */}
          <Card style={styles.followUpCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={28} color={COLORS.warning} />
              <Text style={styles.sectionTitle}>Takip Programı</Text>
            </View>
            <View style={styles.followUpItem}>
              <Text style={styles.followUpLabel}>1 Hafta Sonra:</Text>
              <Text style={styles.followUpText}>Semptom değerlendirmesi</Text>
            </View>
            <View style={styles.followUpItem}>
              <Text style={styles.followUpLabel}>1 Ay Sonra:</Text>
              <Text style={styles.followUpText}>Kontrol analizi</Text>
            </View>
            <View style={styles.followUpItem}>
              <Text style={styles.followUpLabel}>3 Ay Sonra:</Text>
              <Text style={styles.followUpText}>Tam değerlendirme ve karşılaştırma</Text>
            </View>
          </Card>

          <View style={styles.disclaimer}>
            <Ionicons name="information-circle" size={20} color={COLORS.warning} />
            <Text style={styles.disclaimerText}>
              Bu rapor yalnızca bilgilendirme amaçlıdır. Kesin tanı ve tedavi için lütfen bir
              sağlık profesyoneline danışın.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  summaryCard: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  patientDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreItem: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  alertCard: {
    padding: 20,
    backgroundColor: `${COLORS.error}10`,
    borderColor: COLORS.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  criticalItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  criticalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    marginTop: 6,
  },
  criticalContent: {
    flex: 1,
  },
  criticalOrgan: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  criticalNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  vitaminCard: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  vitaminItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  vitaminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitaminName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vitaminSection: {
    marginBottom: 8,
  },
  vitaminLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  vitaminText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dietCard: {
    padding: 20,
  },
  dietPlan: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
  },
  dietTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  dietSection: {
    marginBottom: 12,
  },
  dietLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  dietText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  mealText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
  },
  lifestyleCard: {
    padding: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  followUpCard: {
    padding: 20,
  },
  followUpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  followUpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  followUpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: `${COLORS.warning}20`,
    borderRadius: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
