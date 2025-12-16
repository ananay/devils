export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">Our Story</h1>
          <p className="text-xl text-charcoal-400 max-w-2xl mx-auto">
            Founded on a passion for exceptional spirits and the art of the perfect pour
          </p>
        </div>

        {/* Image */}
        <div 
          className="h-96 rounded-2xl mb-16 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200')" }}
        />

        {/* Content */}
        <div className="prose prose-lg prose-invert mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white mb-6">A Legacy of Excellence</h2>
          <p className="text-charcoal-300 mb-6 leading-relaxed">
            Devil&apos;s Advocate was born in the heart of New Orleans, where the spirit of celebration 
            flows as freely as the Mississippi. What started as a modest speakeasy in 1923 has evolved 
            into the premier destination for discerning spirits enthusiasts.
          </p>
          <p className="text-charcoal-300 mb-6 leading-relaxed">
            Our founder, Jacques Beaumont, believed that every bottle tells a story. From the rolling 
            hills of Kentucky bourbon country to the misty highlands of Scotland, each spirit in our 
            collection has been personally selected to meet our exacting standards.
          </p>

          <h2 className="font-serif text-3xl font-bold text-white mb-6 mt-12">Our Philosophy</h2>
          <p className="text-charcoal-300 mb-6 leading-relaxed">
            We believe that the best spirits are meant to be savored, shared, and celebrated. Whether 
            you&apos;re a seasoned collector seeking a rare vintage or a curious newcomer exploring the 
            world of fine spirits, our expert team is here to guide your journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gold-500 mb-2">100+</div>
              <p className="text-charcoal-400">Years of Tradition</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gold-500 mb-2">500+</div>
              <p className="text-charcoal-400">Premium Spirits</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gold-500 mb-2">50K+</div>
              <p className="text-charcoal-400">Satisfied Customers</p>
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold text-white mb-6 mt-12">Our Promise</h2>
          <p className="text-charcoal-300 mb-6 leading-relaxed">
            Every bottle that leaves our cellar is guaranteed authentic. We work directly with 
            distilleries and trusted distributors to ensure that when you open a Devil&apos;s Advocate 
            bottle, you&apos;re experiencing the spirit exactly as its maker intended.
          </p>
          <p className="text-charcoal-300 mb-6 leading-relaxed">
            From our temperature-controlled storage to our meticulous packaging, every step of 
            our process is designed to deliver perfection to your doorstep.
          </p>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <h2 className="font-serif text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marcus Beaumont',
                role: 'Master Sommelier',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              },
              {
                name: 'Isabelle Chen',
                role: 'Head Curator',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
              },
              {
                name: 'James Morrison',
                role: 'Spirits Historian',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div 
                  className="w-48 h-48 mx-auto rounded-full bg-cover bg-center mb-4"
                  style={{ backgroundImage: `url('${member.image}')` }}
                />
                <h3 className="font-serif text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-gold-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}





