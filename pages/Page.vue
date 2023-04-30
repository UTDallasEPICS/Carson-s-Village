<script lang="ts">
//var page_name="something"
//ask taz about type/data declaration
//export default 
//onMounted(() => {
//})
type donation = {
    first_name : String,
    last_name : String,
    isAnonomous : Boolean,
    comment : String, 
    donation_amount : Number
}

const data_donation = ref<donation>({
    first_name : "",
    last_name : "",
    isAnonomous : false,
    comment : "", 
    donation_amount : 0.0
})
type Page1 = {
    Cuid: String,
    url : String,
    page_name: String,
    day_of_birth: Date,
    day_of_passing: Date,
    visitation_date: Date,
    visitation_location: String,
    timezone: String,
    visitation_description: String,
    funeral_date: Date,
    funeral_description: String,
    funeral_location: String,
    obituary: String,
    deadline: Date,
    donation_goal: Number,
    donated_amount: Number,
    donated_percentage: Number,
    query: String
}
const data_page = ref<Page1>( {
    Cuid : "",
    url : "",
    page_name: "",
    day_of_birth: new Date(),
    day_of_passing: new Date(),
    visitation_date: new Date(),
    visitation_location: "",
    timezone: "",
    visitation_description: "",
    funeral_date: new Date(),
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    deadline: new Date(),
    donation_goal: 0,
    donated_amount:0,
    donated_percentage: 0,
    query: ""
}) 
const create_checkup_session =async () => {
    await useFetch('/api/page_donation',{
    method:'POST',
    body: data_donation
})
const page_data_cookie=useCookie('cv');
const page_data= computed (() => JSON.parse(page_data_cookie.value || "{}"))
const router=useRoute()
const id= computed(() => {router.params.id});
	/* update the progress bar based on donation amount !!!!!
	const progress=document.querySelector('.progress') || "{}";
	progress.style.width=progress.getAttribute('donated-amount') + "%";
	progress.style.opacity=1;
    */
	
}
</script>

<template lang="pug">
doctype html 
head 
	link(rel='preconnect' href='https://fonts.googleapis.com/')
	link(rel='preconnect' href='https://fonts.gstatic.com/' crossorigin='')
	link(href='https://fonts.googleapis.com/css2?family=Poppins:ital@0;1&display=swap' rel='stylesheet')
	link(href='https://fonts.googleapis.com/css2?family=Outfit:wght@600&display=swap' rel='stylesheet')
html
	head
		
		link(rel='stylesheet' href='/stylesheets/main.css')
	.bg-blue.w-screen(class="h-[80px]")
	img.bg-orange-300.-mt-16.mx-auto(class="w-[122px] h-[122px] rounded-[8px]" src=profile)
	.text-gray-dark.font-poppins.text-2xl.text-center.font-semibold(style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);") {{data_page.page_name}}
	.row.text-center
		.text-gray-dark.font-poppins.text-md.inline-block.text-center {{data_page.day_of_birth}}
		.text-gray-dark.font-poppins.text-md.inline-block.whitespace-pre  - 
		.text-gray-dark.font-poppins.text-md.inline-block {{data_page.day_of_passing}}
	.row.p-3
		NuxtLink.mx-16.p-3.px-6.pt-2.text-white.bg-orange-400.font-poppins(style="font-weight: 700; border-radius: 32px;" to='/pages') Back
	.container.bg-gray-light.mx-auto.h-auto.font-poppins(class="w-11/12 rounded-[8px]" style="box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);")
		//ul.inline-flex.py-1.px-1.w-full(id="tabs")
			li.bg-white.text-xs.text-center.px-auto.py-2(class="rounded-[8px] w-1/4")
				a.font-poppins.text-center.font-semibold(style="color:#383838; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);" id="default-tab" href="#obituary") Obituary
			li.text-xs.text-center.px-auto.py-2(class="w-1/4")
				a.font-poppins.text-center.font-semibold(style="color:#383838; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);" href="#services") Services
			li.text-xs.text-center.px-auto.py-2(class="w-1/4")
				a.font-poppins.text-center.font-semibold(style="color:#383838; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);" href="#donations") Donations
			li.text-xs.text-center.px-auto.py-2(class="w-1/4")
				a.font-poppins.text-center.font-semibold(style="color:#383838; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);" href="#media") Media
		.div(style="background: #F8F8F8;" id="tab-contents")
			.div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{data_page.obituary}} Obituary 
			.div.p-4(id="services")
				if visitation_date
					.px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
					.px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{data_page.visation_description}}
					.grid.gap-x-3.gap-y-0.grid-cols-5.grid-rows-2
						img.px-4(src="/images/clock_icon.png")
						.py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{data_page.visitation_date + ", " + data_page.timezone}}
						img.px-2(src="/images/location_icon.png")
						.py-2.font-outfit.text-dark-blue.col-span-4.whitespace-normal(style="font-size: 20px; line-height: 30px;" id="visitation_location") visitation location
				if funeral_date
					.px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
					.px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{data_page.funeral_description}}
					.grid.gap-x-3.gap-y-0.grid-cols-5.grid-rows-2
						img.px-4(src="/images/clock_icon.png")
						.py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{data_page.funeral_date + ", " + data_page.timezone}}
						img.px-2(src="/images/location_icon.png")
						.py-2.font-outfit.text-dark-blue.col-span-4.whitespace-normal.leading-loose(style="font-size: 20px; line-height: 30px;" id="funeral_location") funeral location
			.div.p-4(id="donations")
				.container(class="sm:overflow-hidden sm:w-3/4 sm:mt-4 sm:mx-auto sm:place-content-center sm:max-w-xl sm:p-6 sm:rounded-card sm:shadow-card")
					.container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
						.text-md.text-center.ml-4.my-3(class="sm:text-xl sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{data_page.donated_amount + " raised of " + data_page.donation_goal + " goal"}}
						.progress-bar.overflow-hidden.ml-4.h-5.rounded-full(style="30px; background-color:#b5b5b5;")
							.progress.rounded-full.text-white.flex.items-center.justify-center(donated-amount=donated_percentage style="background: linear-gradient(90deg, rgba(15,200,0,1) 35%, rgba(203,255,0,1) 100%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; height: 100%; opacity: 0; width:0px;") {{data_page.donated_percentage + "%"}}
						.well.well-sm
							h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donor Information
								.bar(style="border-top: 0.5px solid #646464;")
						br
						form.form-horizontal(method='post' action=userAction)
							fieldset
								.col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
									input#first_name.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='donation_data.first_name' type='text' placeholder='First Name' required)
								.col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
									input#last_name.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='donation_data.last_name' type='text' placeholder='Last Name' required)
								.col-md-8.ml-4.pt-4.pr-5.flex
									input#anonymous(type='checkbox' class="sm:ml-1" name='anonymous' value='Bike')
									label.mt-4.ml-4.text-md(for='anonymous' class="sm:mt-0" style="letter-spacing: 0.35px;")  Make this an anonymous donation
								.col-md-8.ml-4.pt-4.pr-5.flex(class="sm:mx-4 sm:w-full sm:py-2")
									textarea#comments.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='donation_data.comments' rows='3' placeholder='Comments' required)
								.col-md-8.ml-4.pt-4.pr-5.grid.grid-cols-3(class="sm:mx-4 sm:w-full sm:py-2")
									span.rounded-l-md.p-3.col-span-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") Donation Amount
									.flex
										span.bg-gray-light.py-2.px-1.text-lg(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4; border-right:none;") $
										input#donation_amount.bg-gray-light.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4; border-left:none;" v-model='donation_data.donation_amount' type="number" min="0.00" step="0.01" required)
								.col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center
									button#submit.mx-auto.p-3.px-6.pt-2.bg-orange.text-md(style="color: white; font-weight: 700; border-radius: 32px;" name='submit') DONATE NOW
			.div.p-4(id="media") 
				.row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
					each image in media ? media : []
						.div(style='position: relative')
							img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" src = image)
							
								 

html
	head
</template>

<style scoped></style>