// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de exercícios com GIFs...");
  
  // Limpa exercícios globais antigos para não duplicar muito
  await prisma.libraryExercise.deleteMany({ where: { userId: null } });

  const exercises = [
  {
    "name": "Alternating Floor Press",
    "category": "Peito",
    "description": "Lie on the floor with two kettlebells next to your shoulders. Position one in place on your chest and then the other, gripping the kettlebells on the handle with the palms facing forward. Extend both arms, so that the kettlebells are being held above your chest. Lower one kettlebell, bringing it to your chest and turn the wrist in the direction of the locked out kettlebell. Raise the kettlebell and repeat on the opposite side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Floor_Press.gif"
  },
  {
    "name": "Around The Worlds",
    "category": "Peito",
    "description": "Lay down on a flat bench holding a dumbbell in each hand with the palms of the hands facing towards the ceiling. Tip: Your arms should be parallel to the floor and next to your thighs. To avoid injury, make sure that you keep your elbows slightly bent. This will be your starting position. Now move the dumbbells by creating a semi-circle as you displace them from the initial position to over the head. All of the movement should happen with the arms parallel to the floor at all times. Breathe in as you perform this portion of the movement. Reverse the movement to return the weight to the starting position as you exhale.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Around_The_Worlds.gif"
  },
  {
    "name": "Barbell Bench Press - Medium Grip",
    "category": "Peito",
    "description": "Lie back on a flat bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position. From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest. After a brief pause, push the bar back to the starting position as you breathe out. Focus on pushing the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position at the top of the motion, hold for a second and then start coming down slowly again. Tip: Ideally, lowering the weight should take about twice as long as raising it. Repeat the movement for the prescribed amount of repetitions. When you are done, place the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Bench_Press_-_Medium_Grip.gif"
  },
  {
    "name": "Barbell Guillotine Bench Press",
    "category": "Peito",
    "description": "Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over your neck with your arms locked. This will be your starting position. As you breathe in, bring the bar down slowly until it is about 1 inch from your neck. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. It should take at least twice as long to go down than to come up. Repeat the movement for the prescribed amount of repetitions. When you are done, place the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Guillotine_Bench_Press.gif"
  },
  {
    "name": "Barbell Incline Bench Press - Medium Grip",
    "category": "Peito",
    "description": "Lie back on an incline bench. Using a medium-width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position. As you breathe in, come down slowly until you feel the bar on you upper chest. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly again. Tip: it should take at least twice as long to go down than to come up. Repeat the movement for the prescribed amount of repetitions. When you are done, place the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Incline_Bench_Press_-_Medium_Grip.gif"
  },
  {
    "name": "Bench Press - With Bands",
    "category": "Peito",
    "description": "Using a flat bench secure a band under the leg of the bench that is nearest to your head. Once the band is secure, grab it by both handles and lie down on the bench. Extend your arms so that you are holding the band handles in front of you at shoulder width. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position. Bring down the handles slowly until your elbow forms a 90 degree angle. Keep full control at all times. As you breathe out, bring the handles up using your pectoral muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up. Repeat the movement for the prescribed amount of repetitions of your training program.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Press_-_With_Bands.gif"
  },
  {
    "name": "Bent-Arm Dumbbell Pullover",
    "category": "Peito",
    "description": "Place a dumbbell standing up on a flat bench. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench (torso across it as in forming a cross) with only your shoulders lying on the surface. Hips should be below the bench and legs bent with feet firmly on the floor. The head will be off the bench as well. Grasp the dumbbell with both hands and hold it straight over your chest with a bend in your arms. Both palms should be pressing against the underside one of the sides of the dumbbell. This will be your starting position. Caution: Always ensure that the dumbbell used for this exercise is secure. Using a dumbbell with loose plates can result in the dumbbell falling apart and falling on your face. While keeping your arms locked in the bent arm position, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest. At that point, bring the dumbbell back to the starting position using the arc through which the weight was lowered and exhale as you perform this movement. Hold the weight on the initial position for a second and repeat the motion for the prescribed number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent-Arm_Dumbbell_Pullover.gif"
  },
  {
    "name": "Bodyweight Flyes",
    "category": "Peito",
    "description": "Position two equally loaded EZ bars on the ground next to each other. Ensure they are able to roll. Assume a push-up position over the bars, supporting your weight on your toes and hands with your arms extended and body straight. Place your hands on the bars. This will be your starting position. Using a slow and controlled motion, move your hands away from the midline of your body, rolling the bars apart. Inhale during this portion of the motion. After moving the bars as far apart as you can, return to the starting position by pulling them back together. Exhale as you perform this movement.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bodyweight_Flyes.gif"
  },
  {
    "name": "Butterfly",
    "category": "Peito",
    "description": "Sit on the machine with your back flat on the pad. Take hold of the handles. Tip: Your upper arms should be positioned parallel to the floor; adjust the machine accordingly. This will be your starting position. Push the handles together slowly as you squeeze your chest in the middle. Breathe out during this part of the motion and hold the contraction for a second. Return back to the starting position slowly as you inhale until your chest muscles are fully stretched. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Butterfly.gif"
  },
  {
    "name": "Cable Chest Press",
    "category": "Peito",
    "description": "Adjust the weight to an appropriate amount and be seated, grasping the handles. Your upper arms should be about 45 degrees to the body, with your head and chest up. The elbows should be bent to about 90 degrees. This will be your starting position. Begin by extending through the elbow, pressing the handles together straight in front of you. Keep your shoulder blades retracted as you execute the movement. After pausing at full extension, return to th starting position, keeping tension on the cables. You can also execute this movement with your back off the pad, at an incline or decline, or alternate hands.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Chest_Press.gif"
  },
  {
    "name": "Cable Crossover",
    "category": "Peito",
    "description": "To get yourself into the starting position, place the pulleys on a high position (above your head), select the resistance to be used and hold the pulleys in each hand. Step forward in front of an imaginary straight line between both pulleys while pulling your arms together in front of you. Your torso should have a small forward bend from the waist. This will be your starting position. With a slight bend on your elbows in order to prevent stress at the biceps tendon, extend your arms to the side (straight out at both sides) in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms and torso should remain stationary; the movement should only occur at the shoulder joint. Return your arms back to the starting position as you breathe out. Make sure to use the same arc of motion used to lower the weights. Hold for a second at the starting position and repeat the movement for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Crossover.gif"
  },
  {
    "name": "Cable Iron Cross",
    "category": "Peito",
    "description": "Begin by moving the pulleys to the high position, select the resistance to be used, and take a handle in each hand. Stand directly between both pulleys with your arms extended out to your sides. Your head and chest should be up while your arms form a \"T\". This will be your starting position. Keeping the elbows extended, pull your arms straight to your sides. Return your arms back to the starting position after a pause at the peak contraction. Continue the movement for the prescribed number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Iron_Cross.gif"
  },
  {
    "name": "Chain Press",
    "category": "Peito",
    "description": "Begin by connecting the chains to the cable handle attachments. Position yourself on the flat bench in the same position as for a dumbbell press. Your wrists should be pronated and arms perpendicular to the floor. This will be your starting position. Lower the chains by flexing the elbows, unloading some of the chain onto the floor. Continue until your elbow forms a 90 degree angle, and then reverse the motion by extending through the elbow to lockout.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chain_Press.gif"
  },
  {
    "name": "Chest Push from 3 point stance",
    "category": "Peito",
    "description": "Begin in a three point stance, squatted down with your back flat and one hand on the ground. Place the medicine ball directly in front of you. To begin, take your first step as you pull the ball to your chest, positioning both hands to prepare for the throw. As you execute the second step, explosively release the ball forward as hard as possible.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_Push_from_3_point_stance.gif"
  },
  {
    "name": "Chest Push (multiple response)",
    "category": "Peito",
    "description": "Begin in a kneeling position facing a wall or utilize a partner. Hold the ball with both hands tight into the chest. Execute the pass by exploding forward and outward with the hips while pushing the ball as hard as possible. Follow through by falling forward, catching yourself with your hands. Immediately return to an upright position. Repeat for the desired number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_Push_multiple_response.gif"
  },
  {
    "name": "Chest Push (single response)",
    "category": "Peito",
    "description": "Begin in a kneeling position holding the medicine ball with both hands tightly into the chest. Execute the pass by exploding forward and outward with the hips while pushing the ball as far as possible. Follow through by falling forward, catching yourself with your hands.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_Push_single_response.gif"
  },
  {
    "name": "Chest Push with Run Release",
    "category": "Peito",
    "description": "Begin in an athletic stance with the knees bent, hips back, and back flat. Hold the medicine ball near your legs. This will be your starting position. While taking your first step draw the medicine ball into your chest. As you take the second step, explosively push the ball forward, immediately sprinting for 10 yards after the release. If you are really fast, you can catch your own pass!",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_Push_with_Run_Release.gif"
  },
  {
    "name": "Clock Push-Up",
    "category": "Peito",
    "description": "Move into a prone position on the floor, supporting your weight on your hands and toes. Your arms should be fully extended with the hands around shoulder width. Keep your body straight throughout the movement. This will be your starting position. Descend by flexing at the elbow, lowering your chest toward the ground. At the bottom, reverse the motion by pushing yourself up through elbow extension as quickly as possible until you are air borne. Aim to \"jump\" 12-18 inches to one side. As you accelerate up, move your outside foot away from your direction of travel. Leaving the ground, shift your body about 30 degrees for the next repetition. Return to the starting position and repeat the exercise, working all the way around until you are back where you started.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Clock_Push-Up.gif"
  },
  {
    "name": "Cross Over - With Bands",
    "category": "Peito",
    "description": "Secure an exercise band around a stationary post. While facing away from the post, grab the handles on both ends of the band and step forward enough to create tension on the band. Raise your arms to the sides, parallel to the floor, perpendicular to your torso (your torso and the arms should resemble the letter \"T\") and with the palms facing forward. Have them extended with a slight bend at the elbows. This will be your starting position. While keeping your arms straight, bring them across your chest in a semicircular motion to the front as you exhale and flex your pecs. Hold the contraction for a second. Slowly return to the starting position as you inhale. Perform for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cross_Over_-_With_Bands.gif"
  },
  {
    "name": "Decline Barbell Bench Press",
    "category": "Peito",
    "description": "Secure your legs at the end of the decline bench and slowly lay down on the bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. The arms should be perpendicular to the floor. This will be your starting position. Tip: In order to protect your rotator cuff, it is best if you have a spotter help you lift the barbell off the rack. As you breathe in, come down slowly until you feel the bar on your lower chest. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up). Repeat the movement for the prescribed amount of repetitions. When you are done, place the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Decline_Barbell_Bench_Press.gif"
  },
  {
    "name": "Decline Dumbbell Bench Press",
    "category": "Peito",
    "description": "Secure your legs at the end of the decline bench and lie down with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other. Once you are laying down, move the dumbbells in front of you at shoulder width. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position. Bring down the weights slowly to your side as you breathe out. Keep full control of the dumbbells at all times. Tip: Throughout the motion, the forearms should always be perpendicular to the floor. As you breathe out, push the dumbbells up using your pectoral muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up.. Repeat the movement for the prescribed amount of repetitions of your training program.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Decline_Dumbbell_Bench_Press.gif"
  },
  {
    "name": "Decline Dumbbell Flyes",
    "category": "Peito",
    "description": "Secure your legs at the end of the decline bench and lie down with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other. Once you are laying down, move the dumbbells in front of you at shoulder width. The palms of the hands should be facing each other and the arms should be perpendicular to the floor and fully extended. This will be your starting position. With a slight bend on your elbows in order to prevent stress at the biceps tendon, lower your arms out at both sides in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms should remain stationary; the movement should only occur at the shoulder joint. Return your arms back to the starting position as you squeeze your chest muscles and breathe out. Tip: Make sure to use the same arc of motion used to lower the weights. Hold for a second at the contracted position and repeat the movement for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Decline_Dumbbell_Flyes.gif"
  },
  {
    "name": "Decline Push-Up",
    "category": "Peito",
    "description": "Lie on the floor face down and place your hands about 36 inches apart while holding your torso up at arms length. Move your feet up to a box or bench. This will be your starting position. Next, lower yourself downward until your chest almost touches the floor as you inhale. Now breathe out and press your upper body back up to the starting position while squeezing your chest. After a brief pause at the top contracted position, you can begin to lower yourself downward again for as many repetitions as needed.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Decline_Push-Up.gif"
  },
  {
    "name": "Decline Smith Press",
    "category": "Peito",
    "description": "Place a decline bench underneath the Smith machine. Now place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Using a pronated grip that is wider than shoulder width, unlock the bar from the rack and hold it straight over you with your arms extended. This will be your starting position. As you inhale, lower the bar under control by allowing the elbows to flex, lightly contacting the torso. After a brief pause, bring the bar back to the starting position by extending the elbows, exhaling as you do so. Repeat the movement for the prescribed amount of repetitions. When the set is complete, lock the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Decline_Smith_Press.gif"
  },
  {
    "name": "Dips - Chest Version",
    "category": "Peito",
    "description": "For this exercise you will need access to parallel bars. To get yourself into the starting position, hold your body at arms length (arms locked) above the bars. While breathing in, lower yourself slowly with your torso leaning forward around 30 degrees or so and your elbows flared out slightly until you feel a slight stretch in the chest. Once you feel the stretch, use your chest to bring your body back to the starting position as you breathe out. Tip: Remember to squeeze the chest at the top of the movement for a second. Repeat the movement for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Dips_-_Chest_Version.gif"
  },
  {
    "name": "Alternating Kettlebell Row",
    "category": "Costas",
    "description": "Place two kettlebells in front of your feet. Bend your knees slightly and push your butt out as much as possible. As you bend over to get into the starting position grab both kettlebells by the handles. Pull one kettlebell off of the floor while holding on to the other kettlebell. Retract the shoulder blade of the working side, as you flex the elbow, drawing the kettlebell towards your stomach or rib cage. Lower the kettlebell in the working arm and repeat with your other arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Kettlebell_Row.gif"
  },
  {
    "name": "Alternating Renegade Row",
    "category": "Costas",
    "description": "Place two kettlebells on the floor about shoulder width apart. Position yourself on your toes and your hands as though you were doing a pushup, with the body straight and extended. Use the handles of the kettlebells to support your upper body. You may need to position your feet wide for support. Push one kettlebell into the floor and row the other kettlebell, retracting the shoulder blade of the working side as you flex the elbow, pulling it to your side. Then lower the kettlebell to the floor and begin the kettlebell in the opposite hand. Repeat for several reps.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Renegade_Row.gif"
  },
  {
    "name": "Atlas Stone Trainer",
    "category": "Costas",
    "description": "This trainer is effective for developing Atlas Stone strength for those who don't have access to stones, and are typically made from bar ends or heavy pipe. Begin by loading the desired weight onto the bar. Straddle the weight, wrapping your arms around the implement, bending at the hips. Begin by pulling the weight up past the knees, extending through the hips. As the weight clears the knees, it can be lapped by resting it on your thighs and sitting back, hugging it tightly to your chest. Finish the movement by extending through your hips and knees to raise the weight as high as possible. The weight can be returned to the lap or to the ground for successive repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Atlas_Stone_Trainer.gif"
  },
  {
    "name": "Atlas Stones",
    "category": "Costas",
    "description": "Begin with the atlas stone between your feet. Bend at the hips to wrap your arms vertically around the Atlas Stone, attempting to get your fingers underneath the stone. Many stones will have a small flat portion on the bottom, which will make the stone easier to hold. Pulling the stone into your torso, drive through the back half of your feet to pull the stone from the ground. As the stone passes the knees, lap it by sitting backward, pulling the stone on top of your thighs. Sit low, getting the stone high onto your chest as you change your grip to reach over the stone. Stand, driving through with your hips. Close distance to the loading platform, and lean back, extending the hips to get the stone as high as possible.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Atlas_Stones.gif"
  },
  {
    "name": "Axle Deadlift",
    "category": "Costas",
    "description": "Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an over/under grip. With your feet and your grip set, take a big breath and then lower your hips and flex the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar. Lower the bar by bending at the hips and guiding it to the floor.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Axle_Deadlift.gif"
  },
  {
    "name": "Band Assisted Pull-Up",
    "category": "Costas",
    "description": "Choke the band around the center of the pullup bar. You can use different bands to provide varying levels of assistance. Pull the end of the band down, and place one bent knee into the loop, ensuring it won't slip out. Take a medium to wide grip on the bar. This will be your starting position. Pull yourself upward by contracting the lats as you flex the elbow. The elbow should be driven to your side. Pull to the front, attempting to get your chin over the bar. Avoid swinging or jerking movements. After a brief pause, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Assisted_Pull-Up.gif"
  },
  {
    "name": "Barbell Deadlift",
    "category": "Costas",
    "description": "Stand in front of a loaded barbell. While keeping the back as straight as possible, bend your knees, bend forward and grasp the bar using a medium (shoulder width) overhand grip. This will be the starting position of the exercise. Tip: If it is difficult to hold on to the bar with this grip, alternate your grip or use wrist straps. While holding the bar, start the lift by pushing with your legs while simultaneously getting your torso to the upright position as you breathe out. In the upright position, stick your chest out and contract the back by bringing the shoulder blades back. Think of how the soldiers in the military look when they are in standing in attention. Go back to the starting position by bending at the knees while simultaneously leaning the torso forward at the waist while keeping the back straight. When the weights on the bar touch the floor you are back at the starting position and ready to perform another repetition. Perform the amount of repetitions prescribed in the program.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Deadlift.gif"
  },
  {
    "name": "Barbell Shrug",
    "category": "Costas",
    "description": "Stand up straight with your feet at shoulder width as you hold a barbell with both hands in front of you using a pronated grip (palms facing the thighs). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for a better grip. This will be your starting position. Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps. Slowly return to the starting position as you breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Shrug.gif"
  },
  {
    "name": "Barbell Shrug Behind The Back",
    "category": "Costas",
    "description": "Stand up straight with your feet at shoulder width as you hold a barbell with both hands behind your back using a pronated grip (palms facing back). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for better grip. This will be your starting position. Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps. The arms should remain stretched out at all times. Slowly return to the starting position as you breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Shrug_Behind_The_Back.gif"
  },
  {
    "name": "Bent-Arm Barbell Pullover",
    "category": "Costas",
    "description": "Lie on a flat bench with a barbell using a shoulder grip width. Hold the bar straight over your chest with a bend in your arms. This will be your starting position. While keeping your arms in the bent arm position, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest. At that point, bring the barbell back to the starting position using the arc through which the weight was lowered and exhale as you perform this movement. Hold the weight on the initial position for a second and repeat the motion for the prescribed number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent-Arm_Barbell_Pullover.gif"
  },
  {
    "name": "Bent Over Barbell Row",
    "category": "Costas",
    "description": "Holding a barbell with a pronated grip (palms facing down), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position. Now, while keeping the torso stationary, breathe out and lift the barbell to you. Keep the elbows close to the body and only use the forearms to hold the weight. At the top contracted position, squeeze the back muscles and hold for a brief pause. Then inhale and slowly lower the barbell back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Barbell_Row.gif"
  },
  {
    "name": "Bent Over One-Arm Long Bar Row",
    "category": "Costas",
    "description": "Put weight on one of the ends of an Olympic barbell. Make sure that you either place the other end of the barbell in the corner of two walls; or put a heavy object on the ground so the barbell cannot slide backward. Bend forward until your torso is as close to parallel with the floor as you can and keep your knees slightly bent. Now grab the bar with one arm just behind the plates on the side where the weight was placed and put your other hand on your knee. This will be your starting position. Pull the bar straight up with your elbow in (to maximize back stimulation) until the plates touch your lower chest. Squeeze the back muscles as you lift the weight up and hold for a second at the top of the movement. Breathe out as you lift the weight. Tip: Do not allow for any swinging of the torso. Only the arm should move. Slowly lower the bar to the starting position getting a nice stretch on the lats. Tip: Do not let the plates touch the floor. To ensure the best range of motion, I recommend using small plates (25-lb ones) as opposed to larger plates (like 35-45lb ones). Repeat for the recommended amount of repetitions and switch arms.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_One-Arm_Long_Bar_Row.gif"
  },
  {
    "name": "Bent Over Two-Arm Long Bar Row",
    "category": "Costas",
    "description": "Put weight on one of the ends of an Olympic barbell. Make sure that you either place the other end of the barbell in the corner of two walls; or put a heavy object on the ground so the barbell cannot slide backward. Bend forward until your torso is as close to parallel with the floor as you can and keep your knees slightly bent. Now grab the bar with both arms just behind the plates on the side where the weight was placed and put your other hand on your knee. This will be your starting position. Pull the bar straight up with your elbows in (to maximize back stimulation) until the plates touch your lower chest. Squeeze the back muscles as you lift the weight up and hold for a second at the top of the movement. Breathe out as you lift the weight. Tip: Use a stirrup or double handle cable attachment by hooking it under the end of the bar. Slowly lower the bar to the starting position getting a nice stretch on the lats. Tip: Do not let the plates touch the floor. To ensure the best range of motion, I recommend using small plates (25-lb ones) as opposed to larger plates (like 35-45lb ones). Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Two-Arm_Long_Bar_Row.gif"
  },
  {
    "name": "Bent Over Two-Dumbbell Row",
    "category": "Costas",
    "description": "With a dumbbell in each hand (palms facing your torso), bend your knees slightly and bring your torso forward by bending at the waist; as you bend make sure to keep your back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The weights should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position. While keeping the torso stationary, lift the dumbbells to your side (as you breathe out), keeping the elbows close to the body (do not exert any force with the forearm other than holding the weights). On the top contracted position, squeeze the back muscles and hold for a second. Slowly lower the weight again to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Two-Dumbbell_Row.gif"
  },
  {
    "name": "Bent Over Two-Dumbbell Row With Palms In",
    "category": "Costas",
    "description": "With a dumbbell in each hand (palms facing each other), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The weights should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position. While keeping the torso stationary, lift the dumbbells to your side as you breathe out, squeezing your shoulder blades together. On the top contracted position, squeeze the back muscles and hold for a second. Slowly lower the weight again to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Two-Dumbbell_Row_With_Palms_In.gif"
  },
  {
    "name": "Bodyweight Mid Row",
    "category": "Costas",
    "description": "Begin by taking a medium to wide grip on a pull-up apparatus with your palms facing away from you. From a hanging position, tuck your knees to your chest, leaning back and getting your legs over your side of the pull-up apparatus. This will be your starting position. Beginning with your arms straight, flex the elbows and retract the shoulder blades to raise your body up until your legs contact the pull-up apparatus. After a brief pause, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bodyweight_Mid_Row.gif"
  },
  {
    "name": "Cable Incline Pushdown",
    "category": "Costas",
    "description": "Lie on incline an bench facing away from a high pulley machine that has a straight bar attachment on it. Grasp the straight bar attachment overhead with a pronated (overhand; palms down) shoulder width grip and extend your arms in front of you. The bar should be around 2 inches away from your upper thighs. This will be your starting position. Keeping the upper arms stationary, lift your arms back in a semi circle until the bar is straight over your head. Breathe in during this portion of the movement. Slowly go back to the starting position using your lats and hold the contraction once you reach the starting position. Breathe out during the execution of this movement. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Incline_Pushdown.gif"
  },
  {
    "name": "Cable Shrugs",
    "category": "Costas",
    "description": "Grasp a cable bar attachment that is attached to a low pulley with a shoulder width or slightly wider overhand (palms facing down) grip. Stand erect close to the pulley with your arms extended in front of you holding the bar. This will be your starting position. Lift the bar by elevating the shoulders as high as possible as you exhale. Hold the contraction at the top for a second. Tip: The arms should remain extended at all times. Refrain from using the biceps to help lift the bar. Only the shoulders should be moving up and down. Lower the bar back to the original position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Shrugs.gif"
  },
  {
    "name": "Calf-Machine Shoulder Shrug",
    "category": "Costas",
    "description": "Position yourself on the calf machine so that the shoulder pads are above your shoulders. Your torso should be straight with the arms extended normally by your side. This will be your starting position. Raise your shoulders up towards your ears as you exhale and hold the contraction for a full second. Slowly return to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Calf-Machine_Shoulder_Shrug.gif"
  },
  {
    "name": "Catch and Overhead Throw",
    "category": "Costas",
    "description": "Begin standing while facing a wall or a partner. Using both hands, position the ball behind your head, stretching as much as possible, and forcefully throw the ball forward. Ensure that you follow your throw through, being prepared to receive your rebound from your throw. If you are throwing against the wall, make sure that you stand close enough to the wall to receive the rebound, and aim a little higher than you would with a partner.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Catch_and_Overhead_Throw.gif"
  },
  {
    "name": "Chin-Up",
    "category": "Costas",
    "description": "Grab the pull-up bar with the palms facing your torso and a grip closer than the shoulder width. As you have both arms extended in front of you holding the bar at the chosen grip width, keep your torso as straight as possible while creating a curvature on your lower back and sticking your chest out. This is your starting position. Tip: Keeping the torso as straight as possible maximizes biceps stimulation while minimizing back involvement. As you breathe out, pull your torso up until your head is around the level of the pull-up bar. Concentrate on using the biceps muscles in order to perform the movement. Keep the elbows close to your body. Tip: The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar. After a second of squeezing the biceps in the contracted position, slowly lower your torso back to the starting position; when your arms are fully extended. Breathe in as you perform this portion of the movement. Repeat this motion for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chin-Up.gif"
  },
  {
    "name": "Clean Shrug",
    "category": "Costas",
    "description": "Begin with a shoulder width, double overhand or hook grip, with the bar hanging at the mid thigh position. Your back should be straight and inclined slightly forward. Shrug your shoulders towards your ears. While this exercise can usually by loaded with heavier weight than a clean, avoid overloading to the point that the execution slows down.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Clean_Shrug.gif"
  },
  {
    "name": "Close-Grip Front Lat Pulldown",
    "category": "Costas",
    "description": "Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar. Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width. As you have both arms extended in front of you - while holding the bar at the chosen grip width - bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position. As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary (only the arms should move). The forearms should do no other work except for holding the bar; therefore do not try to pull the bar down using the forearms. After a second in the contracted position, while squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement. 6. Repeat this motion for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_Front_Lat_Pulldown.gif"
  },
  {
    "name": "Deadlift with Bands",
    "category": "Costas",
    "description": "To deadlift with short bands, simply loop them over the bar before you start, and step into them to set up. For long bands, they will need to be anchored to a secure base, such as heavy dumbbells or a rack. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar. Lower the bar by bending at the hips and guiding it to the floor.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Deadlift_with_Bands.gif"
  },
  {
    "name": "Deadlift with Chains",
    "category": "Costas",
    "description": "You can attach the chains to the sleeves of the bar, or just drape the middle over the bar so there is a greater weight increase as you lift. Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an overhand grip or an over/under grip on heavier sets. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar. Lower the bar by bending at the hips and guiding it to the floor.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Deadlift_with_Chains.gif"
  },
  {
    "name": "Alternate Leg Diagonal Bound",
    "category": "Pernas",
    "description": "Assume a comfortable stance with one foot slightly in front of the other. Begin by pushing off with the front leg, driving the opposite knee forward and as high as possible before landing. Attempt to cover as much distance to each side with each bound. It may help to use a line on the ground to guage distance from side to side. Repeat the sequence with the other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternate_Leg_Diagonal_Bound.gif"
  },
  {
    "name": "Alternating Hang Clean",
    "category": "Pernas",
    "description": "Place two kettlebells between your feet. To get in the starting position, push your butt back and look straight ahead. Clean one kettlebell to your shoulder and hold on to the other kettlebell in a hanging position. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulders. Rotate your wrist as you do so. Lower the cleaned kettlebell to a hanging position and clean the alternate kettlebell. Repeat.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Hang_Clean.gif"
  },
  {
    "name": "Backward Drag",
    "category": "Pernas",
    "description": "Load a sled with the desired weight, attaching a rope or straps to the sled that you can hold onto. Begin the exercise by moving backwards for a given distance. Leaning back, extend through the legs for short steps to move as quickly as possible.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Backward_Drag.gif"
  },
  {
    "name": "Balance Board",
    "category": "Pernas",
    "description": "Place a balance board in front of you. Stand up on it and try to balance yourself. Hold the balance for as long as desired.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Balance_Board.gif"
  },
  {
    "name": "Ball Leg Curl",
    "category": "Pernas",
    "description": "Begin on the floor laying on your back with your feet on top of the ball. Position the ball so that when your legs are extended your ankles are on top of the ball. This will be your starting position. Raise your hips off of the ground, keeping your weight on the shoulder blades and your feet. Flex the knees, pulling the ball as close to you as you can, contracting the hamstrings. After a brief pause, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Ball_Leg_Curl.gif"
  },
  {
    "name": "Band Good Morning",
    "category": "Pernas",
    "description": "Using a 41 inch band, stand on one end, spreading your feet a small amount. Bend at the hips to loop the end of the band behind your neck. This will be your starting position. Keeping your legs straight, extend through the hips to come to a near vertical position. Ensure that you do not round your back as you go down back to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Good_Morning.gif"
  },
  {
    "name": "Band Good Morning (Pull Through)",
    "category": "Pernas",
    "description": "Loop the band around a post. Standing a little ways away, loop the opposite end around the neck. Your hands can help hold the band in position. Begin by bending at the hips, getting your butt back as far as possible. Keep your back flat and bend forward to about 90 degrees. Your knees should be only slightly bent. Return to the starting position be driving through with the hips to come back to a standing position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Good_Morning_Pull_Through.gif"
  },
  {
    "name": "Band Hip Adductions",
    "category": "Pernas",
    "description": "Anchor a band around a solid post or other object. Stand with your left side to the post, and put your right foot through the band, getting it around the ankle. Stand up straight and hold onto the post if needed. This will be your starting position. Keeping the knee straight, raise your right legs out to the side as far as you can. Return to the starting position and repeat for the desired rep count. Switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Hip_Adductions.gif"
  },
  {
    "name": "Barbell Full Squat",
    "category": "Pernas",
    "description": "This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack just above shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso. Step away from the rack and position your legs using a shoulder-width medium stance with the toes slightly pointed out. Keep your head up at all times and maintain a straight back. This will be your starting position. Begin to slowly lower the bar by bending the knees and sitting back with your hips as you maintain a straight posture with the head up. Continue down until your hamstrings are on your calves. Inhale as you perform this portion of the movement. Begin to raise the bar as you exhale by pushing the floor with the heel or middle of your foot as you straighten the legs and extend the hips to go back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Full_Squat.gif"
  },
  {
    "name": "Barbell Glute Bridge",
    "category": "Pernas",
    "description": "Begin seated on the ground with a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise. Roll the bar so that it is directly above your hips, and lay down flat on the floor. Begin the movement by driving through with your heels, extending your hips vertically through the bar. Your weight should be supported by your upper back and the heels of your feet. Extend as far as possible, then reverse the motion to return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Glute_Bridge.gif"
  },
  {
    "name": "Barbell Hack Squat",
    "category": "Pernas",
    "description": "Stand up straight while holding a barbell behind you at arms length and your feet at shoulder width. Tip: A shoulder width grip is best with the palms of your hands facing back. You can use wrist wraps for this exercise for a better grip. This will be your starting position. While keeping your head and eyes up and back straight, squat until your upper thighs are parallel to the floor. Breathe in as you slowly go down. Pressing mainly with the heel of the foot and squeezing the thighs, go back up as you breathe out. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Hack_Squat.gif"
  },
  {
    "name": "Barbell Hip Thrust",
    "category": "Pernas",
    "description": "Begin seated on the ground with a bench directly behind you. Have a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise. Roll the bar so that it is directly above your hips, and lean back against the bench so that your shoulder blades are near the top of it. Begin the movement by driving through your feet, extending your hips vertically through the bar. Your weight should be supported by your shoulder blades and your feet. Extend as far as possible, then reverse the motion to return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Hip_Thrust.gif"
  },
  {
    "name": "Barbell Lunge",
    "category": "Pernas",
    "description": "This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack just below shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso. Step away from the rack and step forward with your right leg and squat down through your hips, while keeping the torso upright and maintaining balance. Inhale as you go down. Note: Do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. li> Using mainly the heel of your foot, push up and go back to the starting position as you exhale. Repeat the movement for the recommended amount of repetitions and then perform with the left leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Lunge.gif"
  },
  {
    "name": "Barbell Seated Calf Raise",
    "category": "Pernas",
    "description": "Place a block about 12 inches in front of a flat bench. Sit on the bench and place the ball of your feet on the block. Have someone place a barbell over your upper thighs about 3 inches above your knees and hold it there. This will be your starting position. Raise up on your toes as high as possible as you squeeze the calves and as you breathe out. After a second contraction, slowly go back to the starting position. Tip: To get maximum benefit stretch your calves as far as you can. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Seated_Calf_Raise.gif"
  },
  {
    "name": "Barbell Side Split Squat",
    "category": "Pernas",
    "description": "Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck). Your feet should be placed wide apart with the foot of the lead leg angled out to the side. This will be your starting position. Lower your body towards the side of your angled foot by bending the knee and hip of your lead leg and while keeping the opposite leg only slightly bent. Breathe in as you lower your body. Return to the starting position by extending the hip and knee of the lead leg. Breathe out as you perform this movement. After performing the recommended amount of reps, repeat the movement with the opposite leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Side_Split_Squat.gif"
  },
  {
    "name": "Barbell Squat",
    "category": "Pernas",
    "description": "This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack to just below shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section). Begin to slowly lower the bar by bending the knees and hips as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Squat.gif"
  },
  {
    "name": "Barbell Squat To A Bench",
    "category": "Pernas",
    "description": "This exercise is best performed inside a squat rack for safety purposes. To begin, first place a flat bench or a box behind you. The flat bench is used to teach you to set your hips back and to hit depth.  Then, set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section). Begin to slowly lower the bar by bending the knees and sitting your hips back as you maintain a straight posture with the head up. Continue down until you slightly touch the bench behind you. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs and extend the hips to go back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Squat_To_A_Bench.gif"
  },
  {
    "name": "Barbell Step Ups",
    "category": "Pernas",
    "description": "Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck) and stand upright behind an elevated platform (such as the one used for spotting behind a flat bench). This is your starting position. Place the right foot on the elevated platform. Step on the platform by extending the hip and the knee of your right leg. Use the heel mainly to lift the rest of your body up and place the foot of the left leg on the platform as well. Breathe out as you execute the force required to come up. Step down with the left leg by flexing the hip and knee of the right leg as you inhale. Return to the original standing position by placing the right foot of to next to the left foot on the initial position. Repeat with the right leg for the recommended amount of repetitions and then perform with the left leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Step_Ups.gif"
  },
  {
    "name": "Barbell Walking Lunge",
    "category": "Pernas",
    "description": "Begin standing with your feet shoulder width apart and a barbell across your upper back. Step forward with one leg, flexing the knees to drop your hips. Descend until your rear knee nearly touches the ground. Your posture should remain upright, and your front knee should stay above the front foot. Drive through the heel of your lead foot and extend both knees to raise yourself back up. Step forward with your rear foot, repeating the lunge on the opposite leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Walking_Lunge.gif"
  },
  {
    "name": "Bear Crawl Sled Drags",
    "category": "Pernas",
    "description": "Wearing either a harness or a loose weight belt, attach the chain to the back so that you will be facing away from the sled. Bend down so that your hands are on the ground. Your back should be flat and knees bent. This is your starting position. Begin by driving with legs, alternating left and right. Use your hands to maintain balance and to help pull. Try to keep your back flat as you move over a given distance.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bear_Crawl_Sled_Drags.gif"
  },
  {
    "name": "Bench Jump",
    "category": "Pernas",
    "description": "Begin with a box or bench 1-2 feet in front of you. Stand with your feet shoulder width apart. This will be your starting position. Perform a short squat in preparation for the jump; swing your arms behind you. Rebound out of this position, extending through the hips, knees, and ankles to jump as high as possible. Swing your arms forward and up. Jump over the bench, landing with the knees bent, absorbing the impact through the legs. Turn around and face the opposite direction, then jump back over the bench.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Jump.gif"
  },
  {
    "name": "Bench Sprint",
    "category": "Pernas",
    "description": "Stand on the ground with one foot resting on a bench or box with your heel close to the edge. Push off with your foot on top of the bench, extending through the hip and knee. Land with the opposite foot on top of the box, returning your other foot back to the start position. Continue alternating from one foot to another to complete the set.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Sprint.gif"
  },
  {
    "name": "Bodyweight Squat",
    "category": "Pernas",
    "description": "Stand with your feet shoulder width apart. You can place your hands behind your head. This will be your starting position. Begin the movement by flexing your knees and hips, sitting back with your hips. Continue down to full depth if you are able,and quickly reverse the motion until you return to the starting position. As you squat, keep your head and chest up and push your knees out.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bodyweight_Squat.gif"
  },
  {
    "name": "Bodyweight Walking Lunge",
    "category": "Pernas",
    "description": "Begin standing with your feet shoulder width apart and your hands on your hips. Step forward with one leg, flexing the knees to drop your hips. Descend until your rear knee nearly touches the ground. Your posture should remain upright, and your front knee should stay above the front foot. Drive through the heel of your lead foot and extend both knees to raise yourself back up. Step forward with your rear foot, repeating the lunge on the opposite leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bodyweight_Walking_Lunge.gif"
  },
  {
    "name": "Box Jump (Multiple Response)",
    "category": "Pernas",
    "description": "Assume a relaxed stance facing the box or platform approximately an arm's length away. Arms should be down at the sides and legs slightly bent. Using the arms to aid in the initial burst, jump upward and forward, landing with feet simultaneously on top of the box or platform. Immediately drop or jump back down to the original starting place; then repeat the sequence.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Box_Jump_Multiple_Response.gif"
  },
  {
    "name": "Alternating Cable Shoulder Press",
    "category": "Ombros",
    "description": "Move the cables to the bottom of the tower and select an appropriate weight. Grasp the cables and hold them at shoulder height, palms facing forward. This will be your starting position. Keeping your head and chest up, extend through the elbow to press one side directly over head. After pausing at the top, return to the starting position and repeat on the opposite side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Cable_Shoulder_Press.gif"
  },
  {
    "name": "Alternating Deltoid Raise",
    "category": "Ombros",
    "description": "In a standing position, hold a pair of dumbbells at your side. Keeping your elbows slightly bent, raise the weights directly in front of you to shoulder height, avoiding any swinging or cheating. Return the weights to your side. On the next repetition, raise the weights laterally, raising them out to your side to about shoulder height. Return the weights to the starting position and continue alternating to the front and side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Deltoid_Raise.gif"
  },
  {
    "name": "Alternating Kettlebell Press",
    "category": "Ombros",
    "description": "Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you pull the kettlebells towards your shoulders. Rotate your wrists as you do so. Press one directly overhead by extending through the elbow, turning it so the palm faces forward while holding the other kettlebell stationary . Lower the pressed kettlebell to the starting position and immediately press with your other arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternating_Kettlebell_Press.gif"
  },
  {
    "name": "Anti-Gravity Press",
    "category": "Ombros",
    "description": "Place a bar on the ground behind the head of an incline bench. Lay on the bench face down. With a pronated grip, pick the barbell up from the floor. Flex the elbows, performing a reverse curl to bring the bar near your chest. This will be your starting position. To begin, press the barbell out in front of your head by extending your elbows. Keep your arms parallel to the ground throughout the movement. Return to the starting position and repeat to complete the set.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Anti-Gravity_Press.gif"
  },
  {
    "name": "Arnold Dumbbell Press",
    "category": "Ombros",
    "description": "Sit on an exercise bench with back support and hold two dumbbells in front of you at about upper chest level with your palms facing your body and your elbows bent. Tip: Your arms should be next to your torso. The starting position should look like the contracted portion of a dumbbell curl. Now to perform the movement, raise the dumbbells as you rotate the palms of your hands until they are facing forward. Continue lifting the dumbbells until your arms are extended above you in straight arm position. Breathe out as you perform this portion of the movement. After a second pause at the top, begin to lower the dumbbells to the original position by rotating the palms of your hands towards you. Tip: The left arm will be rotated in a counter clockwise manner while the right one will be rotated clockwise. Breathe in as you perform this portion of the movement. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Arnold_Dumbbell_Press.gif"
  },
  {
    "name": "Back Flyes - With Bands",
    "category": "Ombros",
    "description": "Run a band around a stationary post like that of a squat rack. Grab the band by the handles and stand back so that the tension in the band rises. Extend and lift the arms straight in front of you. Tip: Your arms should be straight and parallel to the floor while perpendicular to your torso. Your feet should be firmly planted on the floor spread at shoulder width. This will be your starting position. As you exhale, move your arms to the sides and back. Keep your arms extended and parallel to the floor. Continue the movement until the arms are extended to your sides. After a pause, go back to the original position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Back_Flyes_-_With_Bands.gif"
  },
  {
    "name": "Backward Medicine Ball Throw",
    "category": "Ombros",
    "description": "This exercise is best done with a partner. If you lack a partner, the ball can be thrown and retrieved or thrown against a wall. Begin standing a few meters in front of your partner, both facing the same direction. Begin holding the ball between your legs. Squat down and then forcefully reverse direction, coming to full extension and you toss the ball over your head to your partner. Your partner can then roll the ball back to you. Repeat for the desired number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Backward_Medicine_Ball_Throw.gif"
  },
  {
    "name": "Band Pull Apart",
    "category": "Ombros",
    "description": "Begin with your arms extended straight out in front of you, holding the band with both hands. Initiate the movement by performing a reverse fly motion, moving your hands out laterally to your sides. Keep your elbows extended as you perform the movement, bringing the band to your chest. Ensure that you keep your shoulders back during the exercise. Pause as you complete the movement, returning to the starting position under control.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Pull_Apart.gif"
  },
  {
    "name": "Barbell Incline Shoulder Raise",
    "category": "Ombros",
    "description": "Lie back on an Incline Bench. Using a medium width grip (a grip that is slightly wider than shoulder width), lift the bar from the rack and hold it straight over you with your arms straight. This will be your starting position. While keeping the arms straight, lift the bar by protracting your shoulder blades, raising the shoulders from the bench as you breathe out. Bring back the bar to the starting position as you breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Incline_Shoulder_Raise.gif"
  },
  {
    "name": "Barbell Rear Delt Row",
    "category": "Ombros",
    "description": "Stand up straight while holding a barbell using a wide (higher than shoulder width) and overhand (palms facing your body) grip. Bend knees slightly and bend over as you keep the natural arch of your back. Let the arms hang in front of you as they hold the bar. Once your torso is parallel to the floor, flare the elbows out and away from your body. Tip: Your torso and your arms should resemble the letter \"T\". Now you are ready to begin the exercise. While keeping the upper arms perpendicular to the torso, pull the barbell up towards your upper chest as you squeeze the rear delts and you breathe out. Tip: When performed correctly, this exercise should resemble a bench press in reverse. Also, refrain from using your biceps to do the work. Focus on targeting the rear delts; the arms should only act as hooks. Slowly go back to the initial position as you breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Rear_Delt_Row.gif"
  },
  {
    "name": "Barbell Shoulder Press",
    "category": "Ombros",
    "description": "Sit on a bench with back support in a squat rack. Position a barbell at a height that is just above your head. Grab the barbell with a pronated grip (palms facing forward). Once you pick up the barbell with the correct grip width, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position. Lower the bar down to the shoulders slowly as you inhale. Lift the bar back up to the starting position as you exhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Shoulder_Press.gif"
  },
  {
    "name": "Battling Ropes",
    "category": "Ombros",
    "description": "For this exercise you will need a heavy rope anchored at its center 15-20 feet away. Standing in front of the rope, take an end in each hand with your arms extended at your side. This will be your starting position. Initiate the movement by rapidly raising one arm to shoulder level as quickly as you can. As you let that arm drop to the starting position, raise the opposite side. Continue alternating your left and right arms, whipping the ropes up and down as fast as you can.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Battling_Ropes.gif"
  },
  {
    "name": "Bent Over Dumbbell Rear Delt Raise With Head On Bench",
    "category": "Ombros",
    "description": "Stand up straight while holding a dumbbell in each hand and with an incline bench in front of you. While keeping your back straight and maintaining the natural arch of your back, lean forward until your forehead touches the bench in front of you. Let the arms hang in front of you perpendicular to the ground. The palms of your hands should be facing each other and your torso should be parallel to the floor. This will be your starting position. Keeping your torso forward and stationary, and the arms straight with a slight bend at the elbows, lift the dumbbells straight to the side until both arms are parallel to the floor. Exhale as you lift the weights. Caution: avoid swinging the torso or bringing the arms back as opposed to the side. After a one second contraction at the top, slowly lower the dumbbells back to the starting position. Repeat the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench.gif"
  },
  {
    "name": "Bent Over Low-Pulley Side Lateral",
    "category": "Ombros",
    "description": "Select a weight and hold the handle of the low pulley with your right hand. Bend at the waist until your torso is nearly parallel to the floor. Your legs should be slightly bent with your left hand placed on your lower left thigh. Your right arm should be hanging from your shoulder in front of you and with a slight bend at the elbow. This will be your starting position. Raise your right arm, elbow slightly bent, to the side until the arm is parallel to the floor and in line with your right ear. Breathe out as you perform this step. Slowly lower the weight back to the starting position as you breathe in. Repeat for the recommended amount of repetitions and repeat the movement with the other arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Over_Low-Pulley_Side_Lateral.gif"
  },
  {
    "name": "Bradford/Rocky Presses",
    "category": "Ombros",
    "description": "Sit on a Military Press Bench with a bar at shoulder level with a pronated grip (palms facing forward). Tip: Your grip should be wider than shoulder width and it should create a 90-degree angle between the forearm and the upper arm as the barbell goes down. This is your starting position. Once you pick up the barbell with the correct grip, lift the bar up over your head by locking your arms. Now lower the bar down to the back of the head slowly as you inhale. Lift the bar back up to the starting position as you exhale. Lower the bar down to the starting position slowly as you inhale. This is one repetition. Alternate in this manner until you complete the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bradford_Rocky_Presses.gif"
  },
  {
    "name": "Cable Internal Rotation",
    "category": "Ombros",
    "description": "Sit next to a low pulley sideways (with legs stretched in front of you or crossed) and grasp the single hand cable attachment with the arm nearest to the cable. Tip: If you can adjust the pulley's height, you can use a flat bench to sit on instead. Position the elbow against your side with the elbow bent at 90° and the arm pointing towards the pulley. This will be your starting position. Pull the single hand cable attachment toward your body by internally rotating your shoulder until your forearm is across your abs. You will be creating an imaginary semi-circle. Tip: The forearm should be perpendicular to your torso at all times. Slowly go back to the initial position. Repeat for the recommended amount of repetitions and then repeat the movement with the next arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Internal_Rotation.gif"
  },
  {
    "name": "Cable Rear Delt Fly",
    "category": "Ombros",
    "description": "Adjust the pulleys to the appropriate height and adjust the weight. The pulleys should be above your head. Grab the left pulley with your right hand and the right pulley with your left hand, crossing them in front of you. This will be your starting position. Initiate the movement by moving your arms back and outward, keeping your arms straight as you execute the movement. Pause at the end of the motion before returning the handles to the start position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Rear_Delt_Fly.gif"
  },
  {
    "name": "Cable Rope Rear-Delt Rows",
    "category": "Ombros",
    "description": "Sit in the same position on a low pulley row station as you would if you were doing seated cable rows for the back. Attach a rope to the pulley and grasp it with an overhand grip. Your arms should be extended and parallel to the floor with the elbows flared out. Keep your lower back upright and slide your hips back so that your knees are slightly bent. This will be your starting position. Pull the cable attachment towards your upper chest, just below the neck, as you keep your elbows up and out to the sides. Continue this motion as you exhale until the elbows travel slightly behind the back. Tip: Keep your upper arms horizontal, perpendicular to the torso and parallel to the floor throughout the motion. Go back to the initial position where the arms are extended and the shoulders are stretched forward. Inhale as you perform this portion of the movement. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Rope_Rear-Delt_Rows.gif"
  },
  {
    "name": "Cable Seated Lateral Raise",
    "category": "Ombros",
    "description": "Stand in the middle of two low pulleys that are opposite to each other and place a flat bench right behind you (in perpendicular fashion to you; the narrow edge of the bench should be the one behind you). Select the weight to be used on each pulley. Now sit at the edge of the flat bench behind you with your feet placed in front of your knees. Bend forward while keeping your back flat and rest your torso on the thighs. Have someone give you the single handles attached to the pulleys. Grasp the left pulley with the right hand and the right pulley with the left after you select your weight. The pulleys should run under your knees and your arms will be extended with palms facing each other and a slight bend at the elbows. This will be the starting position. While keeping the arms stationary, raise the upper arms to the sides until they are parallel to the floor and at shoulder height. Exhale during the execution of this movement and hold the contraction for a second. Slowly lower your arms to the starting position as you inhale. Repeat for the recommended amount of repetitions. Tip: Maintain upper arms perpendicular to torso and a fixed elbow position (10 degree to 30 degree angle) throughout exercise.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Seated_Lateral_Raise.gif"
  },
  {
    "name": "Cable Shoulder Press",
    "category": "Ombros",
    "description": "Move the cables to the bottom of the towers and select an appropriate weight. Stand directly in between the uprights. Grasp the cables and hold them at shoulder height, palms facing forward. This will be your starting position. Keeping your head and chest up, extend through the elbow to press the handles directly over head. After pausing at the top, return to the starting position and repeat.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Shoulder_Press.gif"
  },
  {
    "name": "Car Drivers",
    "category": "Ombros",
    "description": "While standing upright, hold a barbell plate in both hands at the 3 and 9 o'clock positions. Your palms should be facing each other and your arms should be extended straight out in front of you. This will be your starting position. Initiate the movement by rotating the plate as far to one side as possible. Use the same type of movement you would use to turn a steering wheel to one side. Reverse the motion, turning it all the way to the opposite side. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Car_Drivers.gif"
  },
  {
    "name": "Circus Bell",
    "category": "Ombros",
    "description": "The circus bell is an oversized dumbbell with a thick handle. Begin with the dumbbell between your feet, and grip the handle with both hands. Clean the dumbbell by extending through your hips and knees to deliver the implement to the desired shoulder, letting go with the extra hand. Ensure that you get one of the dumbbell heads behind the shoulder to keep from being thrown off balance. To raise it overhead, dip by flexing the knees, and the drive upwards as you extend the dumbbell overhead, leaning slightly away from it as you do so. Carefully guide the bell back to the floor, keeping it under control as much as possible. It is best to perform this event on a thick rubber mat to prevent damage to the floor.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Circus_Bell.gif"
  },
  {
    "name": "Clean and Jerk",
    "category": "Ombros",
    "description": "With a barbell on the floor close to the shins, take an overhand or hook grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. Move the weight with control as you continue to above the knees. Next comes the second pull, the main source of acceleration for the clean. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out. At peak extension, aggressively pull yourself down, rotating your elbows under the bar as you do so. Receive the bar in a front squat position, the depth of which is dependent upon the height of the bar at the end of the third pull. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom squat position, which will help in the recovery. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position. The second phase is the jerk, which raises the weight overhead. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible. In the brief moment the feet are not actively driving against the platform, the athletes effort to push the bar up will drive them down. The feet should be split, with one foot forward, and one foot back. Receive the bar with the arms locked out overhead. Return to a standing position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Clean_and_Jerk.gif"
  },
  {
    "name": "Clean and Press",
    "category": "Ombros",
    "description": "Assume a shoulder-width stance, with knees inside the arms. Now while keeping the back flat, bend at the knees and hips so that you can grab the bar with the arms fully extended and a pronated grip that is slightly wider than shoulder width. Point the elbows out to sides. The bar should be close to the shins. Position the shoulders over or slightly ahead of the bar. Establish a flat back posture. This will be your starting position. Begin to pull the bar by extending the knees. Move your hips forward and raise the shoulders at the same rate while keeping the angle of the back constant; continue to lift the bar straight up while keeping it close to your body. As the bar passes the knee, extend at the ankles, knees, and hips forcefully, similar to a jumping motion. As you do so, continue to guide the bar with your hands, shrugging your shoulders and using the momentum from your movement to pull the bar as high as possible. The bar should travel close to your body, and you should keep your elbows out. At maximum elevation, your feet should clear the floor and you should start to pull yourself under the bar. The mechanics of this could change slightly, depending on the weight used. You should descend into a squatting position as you pull yourself under the bar. As the bar hits terminal height, rotate your elbows around and under the bar. Rack the bar across the front of the shoulders while keeping the torso erect and flexing the hips and knees to absorb the weight of the bar. Stand to full height, holding the bar in the clean position. Without moving your feet, press the bar overhead as you exhale. Lower the bar under control .",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Clean_and_Press.gif"
  },
  {
    "name": "Crucifix",
    "category": "Ombros",
    "description": "In the crucifix, you statically hold weights out to the side for time. While the event can be practiced using dumbbells, it is best to practice with one of the various implements used, such as axes and hammers, as it feels different. Begin standing, and raise your arms out to the side holding the implements. Your arms should be parallel to the ground. In competition, judges or sensors are used to let you know when you break parallel. Hold for as long as you can. Typically, the weights should be heavy enough that you fail in 30-60 seconds.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Crucifix.gif"
  },
  {
    "name": "Alternate Hammer Curl",
    "category": "Braços",
    "description": "Stand up with your torso upright and a dumbbell in each hand being held at arms length. The elbows should be close to the torso. The palms of the hands should be facing your torso. This will be your starting position. While holding the upper arm stationary, curl the right weight forward while contracting the biceps as you breathe out. Continue the movement until your biceps is fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps. Tip: Only the forearms should move. Slowly begin to bring the dumbbells back to starting position as your breathe in. Repeat the movement with the left hand. This equals one repetition. Continue alternating in this manner for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternate_Hammer_Curl.gif"
  },
  {
    "name": "Alternate Incline Dumbbell Curl",
    "category": "Braços",
    "description": "Sit down on an incline bench with a dumbbell in each hand being held at arms length. Tip: Keep the elbows close to the torso.This will be your starting position. While holding the upper arm stationary, curl the right weight forward while contracting the biceps as you breathe out. As you do so, rotate the hand so that the palm is facing up. Continue the movement until your biceps is fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps. Tip: Only the forearms should move. Slowly begin to bring the dumbbell back to starting position as your breathe in. Repeat the movement with the left hand. This equals one repetition. Continue alternating in this manner for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternate_Incline_Dumbbell_Curl.gif"
  },
  {
    "name": "Band Skull Crusher",
    "category": "Braços",
    "description": "Secure a band to the base of a rack or the bench. Lay on the bench so that the band is lined up with your head. Take hold of the band, raising your elbows so that the upper arm is perpendicular to the floor. With the elbow flexed, the band should be above your head. This will be your starting position. Extend through the elbow to straighten your arm, keeping your upper arm in place. Pause at the top of the motion, and return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Band_Skull_Crusher.gif"
  },
  {
    "name": "Barbell Curl",
    "category": "Braços",
    "description": "Stand up with your torso upright while holding a barbell at a shoulder-width grip. The palm of your hands should be facing forward and the elbows should be close to the torso. This will be your starting position. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard. Slowly begin to bring the bar back to starting position as your breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Curl.gif"
  },
  {
    "name": "Barbell Curls Lying Against An Incline",
    "category": "Braços",
    "description": "Lie against an incline bench, with your arms holding a barbell and hanging down in a horizontal line. This will be your starting position. While keeping the upper arms stationary, curl the weight up as high as you can while squeezing the biceps. Breathe out as you perform this portion of the movement. Tip: Only the forearms should move. Do not swing the arms. After a second contraction, slowly go back to the starting position as you inhale. Tip: Make sure that you go all of the way down. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Curls_Lying_Against_An_Incline.gif"
  },
  {
    "name": "Bench Dips",
    "category": "Braços",
    "description": "For this exercise you will need to place a bench behind your back. With the bench perpendicular to your body, and while looking away from it, hold on to the bench on its edge with the hands fully extended, separated at shoulder width. The legs will be extended forward, bent at the waist and perpendicular to your torso. This will be your starting position. Slowly lower your body as you inhale by bending at the elbows until you lower yourself far enough to where there is an angle slightly smaller than 90 degrees between the upper arm and the forearm. Tip: Keep the elbows as close as possible throughout the movement. Forearms should always be pointing down. Using your triceps to bring your torso up again, lift yourself back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Dips.gif"
  },
  {
    "name": "Bench Press - Powerlifting",
    "category": "Braços",
    "description": "Begin by lying on the bench, getting your head beyond the bar if possible. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement. However wide your grip, it should cover the ring on the bar. Pull the bar out of the rack without protracting your shoulders. Focus on squeezing the bar and trying to pull it apart. Lower the bar to your lower chest or upper stomach. The bar, wrist, and elbow should stay in line at all times. Pause when the barbell touches your torso, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Press_-_Powerlifting.gif"
  },
  {
    "name": "Bench Press with Chains",
    "category": "Braços",
    "description": "Adjust the leader chain, shortening it to the desired length.Place the chains on the sleeves of the bar. Lying on the bench, get your head beyond the bar if possible. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement. However wide your grip, it should cover the ring on the bar. Pull the bar out of the rack without protracting your shoulders. Focus on squeezing the bar and trying to pull it apart. Lower the bar to your lower chest or upper stomach. The bar, wrist, and elbow should stay in line at all times. Pause when the barbell touches your torso, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bench_Press_with_Chains.gif"
  },
  {
    "name": "Board Press",
    "category": "Braços",
    "description": "Begin by lying on the bench, getting your head beyond the bar if possible. One to five boards, made out of 2x6's, can be screwed together and held in place by a training partner, bands, or just tucked under your shirt. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement. You can take a standard bench grip, or shoulder width to focus on the triceps. Pull the bar out of the rack without protracting your shoulders. The bar, wrist, and elbow should stay in line at all times. Focus on squeezing the bar and trying to pull it apart. Lower the bar to the boards, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Board_Press.gif"
  },
  {
    "name": "Body-Up",
    "category": "Braços",
    "description": "Assume a plank position on the ground. You should be supporting your bodyweight on your toes and forearms, keeping your torso straight. Your forearms should be shoulder-width apart. This will be your starting position. Pressing your palms firmly into the ground, extend through the elbows to raise your body from the ground. Keep your torso rigid as you perform the movement. Slowly lower your forearms back to the ground by allowing the elbows to flex. Repeat.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Body-Up.gif"
  },
  {
    "name": "Body Tricep Press",
    "category": "Braços",
    "description": "Position a bar in a rack at chest height. Standing, take a shoulder width grip on the bar and step a yard or two back, feet together and arms extended so that you are leaning on the bar. This will be your starting position. Begin by flexing the elbow, lowering yourself towards the bar. Pause, and then reverse the motion by extending the elbows. Progress from bodyweight by adding chains over your shoulders.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Body_Tricep_Press.gif"
  },
  {
    "name": "Bottoms-Up Clean From The Hang Position",
    "category": "Braços",
    "description": "Initiate the exercise by standing upright with a kettlebell in one hand. Swing the kettlebell back forcefully and then reverse the motion forcefully. Crush the kettlebell handle as hard as possible and raise the kettlebell to your shoulder.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bottoms-Up_Clean_From_The_Hang_Position.gif"
  },
  {
    "name": "Cable Hammer Curls - Rope Attachment",
    "category": "Braços",
    "description": "Attach a rope attachment to a low pulley and stand facing the machine about 12 inches away from it. Grasp the rope with a neutral (palms-in) grip and stand straight up keeping the natural arch of the back and your torso stationary. Put your elbows in by your side and keep them there stationary during the entire movement. Tip: Only the forearms should move; not your upper arms. This will be your starting position. Using your biceps, pull your arms up as you exhale until your biceps touch your forearms. Tip: Remember to keep the elbows in and your upper arms stationary. After a 1 second contraction where you squeeze your biceps, slowly start to bring the weight back to the original position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Hammer_Curls_-_Rope_Attachment.gif"
  },
  {
    "name": "Cable Incline Triceps Extension",
    "category": "Braços",
    "description": "Lie on incline an bench facing away from a high pulley machine that has a straight bar attachment on it. Grasp the straight bar attachment overhead with a pronated (overhand; palms down) narrow grip (less than shoulder width) and keep your elbows tucked in to your sides. Your upper arms should create around a 25 degree angle when measured from the floor. Keeping the upper arms stationary, extend the arms as you flex the triceps. Breathe out during this portion of the movement and hold the contraction for a second. Slowly go back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Incline_Triceps_Extension.gif"
  },
  {
    "name": "Cable Lying Triceps Extension",
    "category": "Braços",
    "description": "Lie on a flat bench and grasp the straight bar attachment of a low pulley with a narrow overhand grip. Tip: The easiest way to do this is to have someone hand you the bar as you lay down. With your arms extended, position the bar over your torso. Your arms and your torso should create a 90-degree angle. This will be your starting position. Lower the bar by bending at the elbow while keeping the upper arms stationary and elbows in. Go down until the bar lightly touches your forehead. Breathe in as you perform this portion of the movement. Flex the triceps as you lift the bar back to its starting position. Exhale as you perform this portion of the movement. Hold for a second at the contracted position and repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Lying_Triceps_Extension.gif"
  },
  {
    "name": "Cable One Arm Tricep Extension",
    "category": "Braços",
    "description": "With your right hand, grasp a single handle attached to the high-cable pulley using a supinated (underhand; palms facing up) grip. You should be standing directly in front of the weight stack. Now pull the handle down so that your upper arm and elbow are locked in to the side of your body. Your upper arm and forearm should form an acute angle (less than 90-degrees). You can keep the other arm by the waist and you can have one leg in front of you and the other one back for better balance. This will be your starting position. As you contract the triceps, move the single handle attachment down to your side until your arm is straight. Breathe out as you perform this movement. Tip: Only the forearms should move. Your upper arms should remain stationary at all times. Squeeze the triceps and hold for a second in this contracted position. Slowly return the handle to the starting position. Repeat for the recommended amount of repetitions and then perform the same movement with the other arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_One_Arm_Tricep_Extension.gif"
  },
  {
    "name": "Cable Preacher Curl",
    "category": "Braços",
    "description": "Place a preacher bench about 2 feet in front of a pulley machine. Attach a straight bar to the low pulley. Sit at the preacher bench with your elbow and upper arms firmly on top of the bench pad and have someone hand you the bar from the low pulley. Grab the bar and fully extend your arms on top of the preacher bench pad. This will be your starting position. Now start pilling the weight up towards your shoulders and squeeze the biceps hard at the top of the movement. Exhale as you perform this motion. Also, hold for a second at the top. Now slowly lower the weight to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Preacher_Curl.gif"
  },
  {
    "name": "Cable Rope Overhead Triceps Extension",
    "category": "Braços",
    "description": "Attach a rope to the bottom pulley of the pulley machine. Grasping the rope with both hands, extend your arms with your hands directly above your head using a neutral grip (palms facing each other). Your elbows should be in close to your head and the arms should be perpendicular to the floor with the knuckles aimed at the ceiling. This will be your starting position. Slowly lower the rope behind your head as you hold the upper arms stationary. Inhale as you perform this movement and pause when your triceps are fully stretched. Return to the starting position by flexing your triceps as you breathe out. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Rope_Overhead_Triceps_Extension.gif"
  },
  {
    "name": "Cable Wrist Curl",
    "category": "Braços",
    "description": "Start out by placing a flat bench in front of a low pulley cable that has a straight bar attachment. Use your arms to grab the cable bar with a narrow to shoulder width supinated grip (palms up) and bring them up so that your forearms are resting against the top of your thighs. Your wrists should be hanging just beyond your knees. Start out by curling your wrist upwards and exhaling. Keep the contraction for a second. Slowly lower your wrists back down to the starting position while inhaling. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Wrist_Curl.gif"
  },
  {
    "name": "Chain Handle Extension",
    "category": "Braços",
    "description": "You will need two cable handle attachments and a flat bench, as well as chains, for this exercise. Clip the middle of the chains to the handles, and position yourself on the flat bench. Your elbows should be pointing straight up. Begin by extending through the elbow, keeping your upper arm still, with your wrists pronated. Pause at the lockout, and reverse the motion to return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chain_Handle_Extension.gif"
  },
  {
    "name": "Close-Grip Barbell Bench Press",
    "category": "Braços",
    "description": "Lie back on a flat bench. Using a close grip (around shoulder width), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position. As you breathe in, come down slowly until you feel the bar on your middle chest. Tip: Make sure that - as opposed to a regular bench press - you keep the elbows close to the torso at all times in order to maximize triceps involvement. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your triceps muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up. Repeat the movement for the prescribed amount of repetitions. When you are done, place the bar back in the rack.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_Barbell_Bench_Press.gif"
  },
  {
    "name": "Close-Grip Dumbbell Press",
    "category": "Braços",
    "description": "Place a dumbbell standing up on a flat bench. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench with only your shoulders lying on the surface. Hips should be below the bench and your legs bent with your feet firmly on the floor. Grasp the dumbbell with both hands and hold it straight over your chest at arm's length. Both palms should be pressing against the underside of the sides of the dumbbell. This will be your starting position. Initiate the movement by lowering the dumbbell to your chest. Return to the starting position by extending the elbows.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_Dumbbell_Press.gif"
  },
  {
    "name": "Close-Grip EZ-Bar Curl with Band",
    "category": "Braços",
    "description": "Attach a band to each end of the bar. Take the bar, placing a foot on the middle of the band. Stand upright with a narrow, supinated grip on the EZ bar. The elbows should be close to the torso. This will be your starting position. While keeping the upper arms in place, flex the elbows to execute the curl. Exhale as the weight is lifted. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard. Slowly begin to bring the bar back to starting position as your breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_EZ-Bar_Curl_with_Band.gif"
  },
  {
    "name": "Close-Grip EZ-Bar Press",
    "category": "Braços",
    "description": "Lie on a flat bench with an EZ bar loaded to an appropriate weight. Using a narrow grip lift the bar and hold it straight over your torso with your elbows in. The arms should be perpendicular to the floor. This will be your starting position. Now lower the bar down to your lower chest as you breathe in. Keep the elbows in as you perform this movement. Using the triceps to push the bar back up, press it back to the starting position by extending the elbows as you exhale. Repeat.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_EZ-Bar_Press.gif"
  },
  {
    "name": "Close-Grip EZ Bar Curl",
    "category": "Braços",
    "description": "Stand up with your torso upright while holding an E-Z Curl Bar at the closer inner handle. The palm of your hands should be facing forward and they should be slightly tilted inwards due to the shape of the bar. The elbows should be close to the torso. This will be your starting position. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard. Slowly begin to bring the bar back to starting position as your breathe in. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Close-Grip_EZ_Bar_Curl.gif"
  },
  {
    "name": "3/4 Sit-Up",
    "category": "Core",
    "description": "Lie down on the floor and secure your feet. Your legs should be bent at the knees. Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position. Flex your hips and spine to raise your torso toward your knees. At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/3_4_Sit-Up.gif"
  },
  {
    "name": "Ab Crunch Machine",
    "category": "Core",
    "description": "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position. At the same time, begin to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. Concentrate on using your abs to move the weight while relaxing your legs and feet. After a second pause, slowly return to the starting position as you breathe in. Repeat the movement for the prescribed amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Ab_Crunch_Machine.gif"
  },
  {
    "name": "Ab Roller",
    "category": "Core",
    "description": "Hold the Ab Roller with both hands and kneel on the floor. Now place the ab roller on the floor in front of you so that you are on all your hands and knees (as in a kneeling push up position). This will be your starting position. Slowly roll the ab roller straight forward, stretching your body into a straight position. Tip: Go down as far as you can without touching the floor with your body. Breathe in during this portion of the movement. After a pause at the stretched position, start pulling yourself back to the starting position as you breathe out. Tip: Go slowly and keep your abs tight at all times.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Ab_Roller.gif"
  },
  {
    "name": "Advanced Kettlebell Windmill",
    "category": "Core",
    "description": "Clean and press a kettlebell overhead with one arm. Keeping the kettlebell locked out at all times, push your butt out in the direction of the locked out kettlebell. Keep the non-working arm behind your back and turn your feet out at a forty-five degree angle from the arm with the kettlebell. Lower yourself as far as possible. Pause for a second and reverse the motion back to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Advanced_Kettlebell_Windmill.gif"
  },
  {
    "name": "Air Bike",
    "category": "Core",
    "description": "Lie flat on the floor with your lower back pressed to the ground. For this exercise, you will need to put your hands beside your head. Be careful however to not strain with the neck as you perform it. Now lift your shoulders into the crunch position. Bring knees up to where they are perpendicular to the floor, with your lower legs parallel to the floor. This will be your starting position. Now simultaneously, slowly go through a cycle pedal motion kicking forward with the right leg and bringing in the knee of the left leg. Bring your right elbow close to your left knee by crunching to the side, as you breathe out. Go back to the initial position as you breathe in. Crunch to the opposite side as you cycle your legs and bring closer your left elbow to your right knee and exhale. Continue alternating in this manner until all of the recommended repetitions for each side have been completed.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Air_Bike.gif"
  },
  {
    "name": "Alternate Heel Touchers",
    "category": "Core",
    "description": "Lie on the floor with the knees bent and the feet on the floor around 18-24 inches apart. Your arms should be extended by your side. This will be your starting position. Crunch over your torso forward and up about 3-4 inches to the right side and touch your right heel as you hold the contraction for a second. Exhale while performing this movement. Now go back slowly to the starting position as you inhale. Now crunch over your torso forward and up around 3-4 inches to the left side and touch your left heel as you hold the contraction for a second. Exhale while performing this movement and then go back to the starting position as you inhale. Now that both heels have been touched, that is considered 1 repetition. Continue alternating sides in this manner until all prescribed repetitions are done.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Alternate_Heel_Touchers.gif"
  },
  {
    "name": "Barbell Ab Rollout",
    "category": "Core",
    "description": "For this exercise you will need to get into a pushup position, but instead of having your hands of the floor, you will be grabbing on to an Olympic barbell (loaded with 5-10 lbs on each side) instead. This will be your starting position. While keeping a slight arch on your back, lift your hips and roll the barbell towards your feet as you exhale. Tip: As you perform the movement, your glutes should be coming up, you should be keeping the abs tight and should maintain your back posture at all times. Also your arms should be staying perpendicular to the floor throughout the movement. If you don't, you will work out your shoulders and back more than the abs. After a second contraction at the top, start to roll the barbell back forward to the starting position slowly as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Ab_Rollout.gif"
  },
  {
    "name": "Barbell Ab Rollout - On Knees",
    "category": "Core",
    "description": "Hold an Olympic barbell loaded with 5-10lbs on each side and kneel on the floor. Now place the barbell on the floor in front of you so that you are on all your hands and knees (as in a kneeling push up position). This will be your starting position. Slowly roll the barbell straight forward, stretching your body into a straight position. Tip: Go down as far as you can without touching the floor with your body. Breathe in during this portion of the movement. After a second pause at the stretched position, start pulling yourself back to the starting position as you breathe out. Tip: Go slowly and keep your abs tight at all times.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Ab_Rollout_-_On_Knees.gif"
  },
  {
    "name": "Barbell Rollout from Bench",
    "category": "Core",
    "description": "Place a loaded barbell on the ground, near the end of a bench. Kneel with both legs on the bench, and take a medium to narrow grip on the barbell. This will be your starting position. To begin, extend through the hips to slowly roll the bar forward. As you roll out, flex the shoulder to roll the bar above your head. Ensure that your arms remain extended throughout the movement. When the bar has been moved as far forward as possible, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Rollout_from_Bench.gif"
  },
  {
    "name": "Barbell Side Bend",
    "category": "Core",
    "description": "Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck). Your feet should be shoulder width apart. This will be your starting position. While keeping your back straight and your head up, bend only at the waist to the right as far as possible. Breathe in as you bend to the side. Then hold for a second and come back up to the starting position as you exhale. Tip: Keep the rest of the body stationary. Now repeat the movement but bending to the left instead. Hold for a second and come back to the starting position. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Barbell_Side_Bend.gif"
  },
  {
    "name": "Bent-Knee Hip Raise",
    "category": "Core",
    "description": "Lay flat on the floor with your arms next to your sides. Now bend your knees at around a 75 degree angle and lift your feet off the floor by around 2 inches. Using your lower abs, bring your knees in towards you as you maintain the 75 degree angle bend in your legs. Continue this movement until you raise your hips off of the floor by rolling your pelvis backward. Breathe out as you perform this portion of the movement. Tip: At the end of the movement your knees will be over your chest. Squeeze your abs at the top of the movement for a second and then return to the starting position slowly as you breathe in. Tip: Maintain a controlled motion at all times. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent-Knee_Hip_Raise.gif"
  },
  {
    "name": "Bent Press",
    "category": "Core",
    "description": "Clean a kettlebell to your shoulder. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so. This will be your starting position. Begin my leaning to the side opposite the kettlebell, continuing until you are able to touch the ground with your free hand, keeping your eyes on the kettlebell. As you do so, press the weight vertically be extending through the elbow, keeping your arm perpendicular to the ground. Return to an upright position, with the kettlebell above your head. Return the kettlebell to the shoulder and repeat for the desired number of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bent_Press.gif"
  },
  {
    "name": "Bosu Ball Cable Crunch With Side Bends",
    "category": "Core",
    "description": "Connect a standard handle to each arm of a cable machine, and position them in the most downward position. Grab a Bosu Ball and position it in front and center of the cable machine. Lie down on the Bosu Ball with the small of your back arched around the ball. Your rear end should be close to the floor without touching it. With both hands, reach back and grab the handle of each cable. With your feet positioned in a wide stance, extend your arms straight out in front of you and in between your knees. Your hands should be at knee level. Keep your arms straight and in-line with the upward angle of the cable. Elevate your torso in a crunching motion without dropping or bending your arms. Maintain the rigid position with your arms. Slowly descend back to the starting position with your back arched around the Bosu Ball and your abdominals elongated. Repeat the same series of movements to failure. Once you reach failure, keep your abs tight and raise your torso into plank position so your back is elevated off the Bosu Ball. Lower your arms down to your side; keep them straight. Start doing alternating side bends; reach for your heels! This finishing movement will focus on your obliques.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bosu_Ball_Cable_Crunch_With_Side_Bends.gif"
  },
  {
    "name": "Bottoms Up",
    "category": "Core",
    "description": "Begin by lying on your back on the ground. Your legs should be straight and your arms at your side. This will be your starting position. To perform the movement, tuck the knees toward your chest by flexing the hips and knees. Following this, extend your legs directly above you so that they are perpendicular to the ground. Rotate and elevate your pelvis to raise your glutes from the floor. After a brief pause, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bottoms_Up.gif"
  },
  {
    "name": "Butt-Ups",
    "category": "Core",
    "description": "Begin a pushup position but with your elbows on the ground and resting on your forearms. Your arms should be bent at a 90 degree angle. Arch your back slightly out rather than keeping your back completely straight. Raise your glutes toward the ceiling, squeezing your abs tightly to close the distance between your ribcage and hips. The end result will be that you'll end up in a high bridge position. Exhale as you perform this portion of the movement. Lower back down slowly to your starting position as you breathe in. Tip: Don't let your back sag downwards. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Butt-Ups.gif"
  },
  {
    "name": "Cable Crunch",
    "category": "Core",
    "description": "Kneel below a high pulley that contains a rope attachment. Grasp cable rope attachment and lower the rope until your hands are placed next to your face. Flex your hips slightly and allow the weight to hyperextend the lower back. This will be your starting position. With the hips stationary, flex the waist as you contract the abs so that the elbows travel towards the middle of the thighs. Exhale as you perform this portion of the movement and hold the contraction for a second. Slowly return to the starting position as you inhale. Tip: Make sure that you keep constant tension on the abs throughout the movement. Also, do not choose a weight so heavy that the lower back handles the brunt of the work. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Crunch.gif"
  },
  {
    "name": "Cable Judo Flip",
    "category": "Core",
    "description": "Connect a rope attachment to a tower, and move the cable to the lowest pulley position. Stand with your side to the cable with a wide stance, and grab the rope with both hands. Twist your body away from the pulley as you bring the rope over your shoulder like you're performing a judo flip. Shift your weight between your feet as you twist and crunch forward, pulling the cable downward. Return to the starting position and repeat until failure. Then, reposition and repeat the same series of movements on the opposite side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Judo_Flip.gif"
  },
  {
    "name": "Cable Reverse Crunch",
    "category": "Core",
    "description": "Connect an ankle strap attachment to a low pulley cable and position a mat on the floor in front of it. Sit down with your feet toward the pulley and attach the cable to your ankles. Lie down, elevate your legs and bend your knees at a 90-degree angle. Your legs and the cable should be aligned. If not, adjust the pulley up or down until they are. With your hands behind your head, bring your knees inward to your torso and elevate your hips off the floor. Pause for a moment and in a slow and controlled manner drop your hips and bring your legs back to the starting 90-degree angle. You should still have tension on your abs in the resting position. Repeat the same movement to failure.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Reverse_Crunch.gif"
  },
  {
    "name": "Cable Russian Twists",
    "category": "Core",
    "description": "Connect a standard handle attachment, and position the cable to a middle pulley position. Lie on a stability ball perpendicular to the cable and grab the handle with one hand. You should be approximately arm's length away from the pulley, with the tension of the weight on the cable. Grab the handle with both hands and fully extend your arms above your chest. You hands should be directly in-line with the pulley. If not, adjust the pulley up or down until they are. Keep your hips elevated and abs engaged. Rotate your torso away from the pulley for a full-quarter rotation. Your body should be flat from head to knees. Pause for a moment and in a slow and controlled manner reset to the starting position. You should still have side tension on the cable in the resting position. Repeat the same movement to failure. Then, reposition and repeat the same series of movements on the opposite side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Russian_Twists.gif"
  },
  {
    "name": "Cable Seated Crunch",
    "category": "Core",
    "description": "Seat on a flat bench with your back facing a high pulley. Grasp the cable rope attachment with both hands (with the palms of the hands facing each other) and place your hands securely over both shoulders. Tip: Allow the weight to hyperextend the lower back slightly. This will be your starting position. With the hips stationary, flex the waist so the elbows travel toward the hips. Breathe out as you perform this step. As you inhale, go back to the initial position slowly. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cable_Seated_Crunch.gif"
  },
  {
    "name": "Cocoons",
    "category": "Core",
    "description": "Begin by lying on your back on the ground. Your legs should be straight and your arms extended behind your head. This will be your starting position. To perform the movement, tuck the knees toward your chest, rotating your pelvis to lift your glutes from the floor. As you do so, flex the spine, bringing your arms back over your head to perform a simultaneous crunch motion. After a brief pause, return to the starting position.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cocoons.gif"
  },
  {
    "name": "Cross-Body Crunch",
    "category": "Core",
    "description": "Lie flat on your back and bend your knees about 60 degrees. Keep your feet flat on the floor and place your hands loosely behind your head. This will be your starting position. Now curl up and bring your right elbow and shoulder across your body while bring your left knee in toward your left shoulder at the same time. Reach with your elbow and try to touch your knee. Exhale as you perform this movement. Tip: Try to bring your shoulder up towards your knee rather than just your elbow and remember that the key is to contract the abs as you perform the movement; not just to move the elbow. Now go back down to the starting position as you inhale and repeat with the left elbow and the right knee. Continue alternating in this manner until all prescribed repetitions are done.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cross-Body_Crunch.gif"
  },
  {
    "name": "Crunch - Hands Overhead",
    "category": "Core",
    "description": "Lie on the floor with your back flat and knees bent with around a 60-degree angle between the hamstrings and the calves. Keep your feet flat on the floor and stretch your arms overhead with your palms crossed. This will be your starting position. Curl your upper body forward and bring your shoulder blades just off the floor. At all times, keep your arms aligned with your head, neck and shoulder. Don't move them forward from that position. Exhale as you perform this portion of the movement and hold the contraction for a second. Slowly lower down to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Crunch_-_Hands_Overhead.gif"
  },
  {
    "name": "Crunch - Legs On Exercise Ball",
    "category": "Core",
    "description": "Lie flat on your back with your feet resting on an exercise ball and your knees bent at a 90 degree angle. Place your feet three to four inches apart and point your toes inward so they touch. Place your hands lightly on either side of your head keeping your elbows in. Tip: Don't lock your fingers behind your head. Push the small of your back down in the floor in order to better isolate your abdominal muscles. This will be your starting position. Begin to roll your shoulders off the floor and continue to push down as hard as you can with your lower back. Your shoulders should come up off the floor only about four inches, and your lower back should remain on the floor. Breathe out as you execute this portion of the movement. Squeeze your abdominals hard at the top of the contraction and hold for a second. Tip: Focus on a slow, controlled movement. Refrain from using momentum at any time. Slowly go back down to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Crunch_-_Legs_On_Exercise_Ball.gif"
  },
  {
    "name": "Crunches",
    "category": "Core",
    "description": "Lie flat on your back with your feet flat on the ground, or resting on a bench with your knees bent at a 90 degree angle. If you are resting your feet on a bench, place them three to four inches apart and point your toes inward so they touch. Now place your hands lightly on either side of your head keeping your elbows in. Tip: Don't lock your fingers behind your head. While pushing the small of your back down in the floor to better isolate your abdominal muscles, begin to roll your shoulders off the floor. Continue to push down as hard as you can with your lower back as you contract your abdominals and exhale. Your shoulders should come up off the floor only about four inches, and your lower back should remain on the floor. At the top of the movement, contract your abdominals hard and keep the contraction for a second. Tip: Focus on slow, controlled movement - don't cheat yourself by using momentum. After the one second contraction, begin to come down slowly again to the starting position as you inhale. Repeat for the recommended amount of repetitions.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Crunches.gif"
  },
  {
    "name": "Bicycling",
    "category": "Cardio",
    "description": "To begin, seat yourself on the bike and adjust the seat to your height.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bicycling.gif"
  },
  {
    "name": "Bicycling, Stationary",
    "category": "Cardio",
    "description": "To begin, seat yourself on the bike and adjust the seat to your height. Select the desired option from the menu. You may have to start pedaling to turn it on. You can use the manual setting, or you can select a program to use. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. The level of resistance can be changed throughout the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Bicycling_Stationary.gif"
  },
  {
    "name": "Elliptical Trainer",
    "category": "Cardio",
    "description": "To begin, step onto the elliptical and select the desired option from the menu. Most ellipticals have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Elliptical_Trainer.gif"
  },
  {
    "name": "Jogging, Treadmill",
    "category": "Cardio",
    "description": "To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than jogging outside. A 150 lb person will burn almost 250 calories jogging for 30 minutes, compared to more than 450 calories running. Maintain proper posture as you jog, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Jogging_Treadmill.gif"
  },
  {
    "name": "Prowler Sprint",
    "category": "Cardio",
    "description": "Place your sled on an appropriate surface, loaded to a suitable weight. The sled should provide enough resistance to require effort, but not so heavy that you are significantly slowed down. You may use the upright or the low handles for this exercise. Place your hands on the handles with your arms extended, leaning into the implement. With good posture, drive through the ground with alternating, short steps. Move as fast as you can for a short distance.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Prowler_Sprint.gif"
  },
  {
    "name": "Recumbent Bike",
    "category": "Cardio",
    "description": "To begin, seat yourself on the bike and adjust the seat to your height. Select the desired option from the menu. You may have to start pedaling to turn it on. You can use the manual setting, or you can select a program to use. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. The level of resistance can be changed throughout the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity. Recumbent bikes offer convenience, cardiovascular benefits, and have less impact than other activities. A 150 lb person will burn about 230 calories cycling at a moderate rate for 30 minutes, compared to 450 calories or more running.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Recumbent_Bike.gif"
  },
  {
    "name": "Rope Jumping",
    "category": "Cardio",
    "description": "Hold an end of the rope in each hand. Position the rope behind you on the ground. Raise your arms up and turn the rope over your head bringing it down in front of you. When it reaches the ground, jump over it. Find a good turning pace that can be maintained. Different speeds and techniques can be used to introduce variation. Rope jumping is exciting, challenges your coordination, and requires a lot of energy. A 150 lb person will burn about 350 calories jumping rope for 30 minutes, compared to over 450 calories running.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Rope_Jumping.gif"
  },
  {
    "name": "Rowing, Stationary",
    "category": "Cardio",
    "description": "To begin, seat yourself on the rower. Make sure that your heels are resting comfortably against the base of the foot pedals and that the straps are secured. Select the program that you wish to use, if applicable. Sit up straight and bend forward at the hips. There are three phases of movement when using a rower. The first phase is when you come forward on the rower. Your knees are bent and against your chest. Your upper body is leaning slightly forward while still maintaining good posture. Next, push against the foot pedals and extend your legs while bringing your hands to your upper abdominal area, squeezing your shoulders back as you do so. To avoid straining your back, use primarily your leg and hip muscles. The recovery phase simply involves straightening your arms, bending the knees, and bringing your body forward again as you transition back into the first phase.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Rowing_Stationary.gif"
  },
  {
    "name": "Running, Treadmill",
    "category": "Cardio",
    "description": "To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than running outside. A 150 lb person will burn over 450 calories running 8 miles per hour for 30 minutes. Maintain proper posture as you run, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Running_Treadmill.gif"
  },
  {
    "name": "Skating",
    "category": "Cardio",
    "description": "Roller skating is a fun activity which can be effective in improving cardiorespiratory fitness and muscular endurance. It requires relatively good balance and coordination. It is necessary to learn the basics of skating including turning and stopping and to wear protective gear to avoid possible injury. You can skate at a comfortable pace for 30 minutes straight. If you want a cardio challenge, do interval skating — speed skate two minutes of every five minutes, using the remaining three minutes to recover. A 150 lb person will typically burn about 175 calories in 30 minutes skating at a comfortable pace, similar to brisk walking.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Skating.gif"
  },
  {
    "name": "Stairmaster",
    "category": "Cardio",
    "description": "To begin, step onto the stairmaster and select the desired option from the menu. You can choose a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Pump your legs up and down in an established rhythm, driving the pedals down but not all the way to the floor. It is recommended that you maintain your grip on the handles so that you don't fall. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity. Stairmasters offer convenience, cardiovascular benefits, and usually have less impact than running outside. They are typically much harder than other cardio equipment. A 150 lb person will typically burn over 300 calories in 30 minutes, compared to about 175 calories walking.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Stairmaster.gif"
  },
  {
    "name": "Step Mill",
    "category": "Cardio",
    "description": "To begin, step onto the stepmill and select the desired option from the menu. You can choose a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Use caution so that you don't trip as you climb the stairs. It is recommended that you maintain your grip on the handles so that you don't fall. Stepmills offer convenience, cardiovascular benefits, and usually have less impact than running outside while offering a similar rate of calories burned. They are typically much harder than other cardio equipment. A 150 lb person will typically burn over 300 calories in 30 minutes, compared to about 175 calories walking.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Step_Mill.gif"
  },
  {
    "name": "Trail Running/Walking",
    "category": "Cardio",
    "description": "Running or hiking on trails will get the blood pumping and heart beating almost immediately. Make sure you have good shoes. While you use the muscles in your calves and buttocks to pull yourself up a hill, the knees, joints and ankles absorb the bulk of the pounding coming back down. Take smaller steps as you walk downhill, keep your knees bent to reduce the impact and slow down to avoid falling. A 150 lb person can burn over 200 calories for 30 minutes walking uphill, compared to 175 on a flat surface. If running the trail, a 150 lb person can burn well over 500 calories in 30 minutes.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Trail_Running_Walking.gif"
  },
  {
    "name": "Walking, Treadmill",
    "category": "Cardio",
    "description": "To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than walking outside. When walking, you should move at a moderate to fast pace, not a leisurely one. Being an activity of lower intensity, walking doesn't burn as many calories as some other activities, but still provides great benefit. A 150 lb person will burn about 175 calories walking 4 miles per hour for 30 minutes, compared to 450 calories running twice as fast. Maintain proper posture as you walk, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Walking_Treadmill.gif"
  },
  {
    "name": "90/90 Hamstring",
    "category": "Mobilidade",
    "description": "Lie on your back, with one leg extended straight out. With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position. Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position. Repeat for 10-20 repetitions, and then switch to the other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/90_90_Hamstring.gif"
  },
  {
    "name": "Adductor",
    "category": "Mobilidade",
    "description": "Lie face down with one leg on a foam roll. Rotate the leg so that the foam roll contacts against your inner thigh. Shift as much weight onto the foam roll as can be tolerated. While trying to relax the muscles if the inner thigh, roll over the foam between your hip and knee, holding points of tension for 10-30 seconds. Repeat with the other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Adductor.gif"
  },
  {
    "name": "Adductor/Groin",
    "category": "Mobilidade",
    "description": "Lie on your back with your feet raised towards the ceiling. Have your partner hold your feet or ankles. Abduct your legs as far as you can. This will be your starting position. Attempt to squeeze your legs together for 10 or more seconds, while your partner prevents you from doing so. Now, relax the muscles in your legs as your partner pushes your feet apart, stretching as far as is comfortable for you. Be sure to let your partner know when the stretch is adequate to prevent overstretching or injury.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Adductor_Groin.gif"
  },
  {
    "name": "All Fours Quad Stretch",
    "category": "Mobilidade",
    "description": "Start off on your hands and knees, then lift your leg off the floor and hold the foot with your hand. Use your hand to hold the foot or ankle, keeping the knee fully flexed, stretching the quadriceps and hip flexors. Focus on extending your hips, thrusting them towards the floor. Hold for 10-20 seconds and then switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/All_Fours_Quad_Stretch.gif"
  },
  {
    "name": "Ankle Circles",
    "category": "Mobilidade",
    "description": "Use a sturdy object like a squat rack to hold yourself. Lift the right leg in the air (just around 2 inches from the floor) and perform a circular motion with the big toe. Pretend that you are drawing a big circle with it. Tip: One circle equals 1 repetition. Breathe normally as you perform the movement. When you are done with the right foot, then repeat with the left leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Ankle_Circles.gif"
  },
  {
    "name": "Ankle On The Knee",
    "category": "Mobilidade",
    "description": "From a lying position, bend your knees and keep your feet on the floor. Place your ankle of one foot on your opposite knee. Grasp the thigh or knee of the bottom leg and pull both of your legs into the chest. Relax your neck and shoulders. Hold for 10-20 seconds and then switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Ankle_On_The_Knee.gif"
  },
  {
    "name": "Anterior Tibialis-SMR",
    "category": "Mobilidade",
    "description": "Begin seated on the ground with your legs bent and your feet on the floor. Using a Muscle Roller or a rolling pin, apply pressure to the muscles on the outside of your shins. Work from just below the knee to above the ankle, pausing at points of tension for 10-30 seconds. Repeat on the other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Anterior_Tibialis-SMR.gif"
  },
  {
    "name": "Arm Circles",
    "category": "Mobilidade",
    "description": "Stand up and extend your arms straight out by the sides. The arms should be parallel to the floor and perpendicular (90-degree angle) to your torso. This will be your starting position. Slowly start to make circles of about 1 foot in diameter with each outstretched arm. Breathe normally as you perform the movement. Continue the circular motion of the outstretched arms for about ten seconds. Then reverse the movement, going the opposite direction.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Arm_Circles.gif"
  },
  {
    "name": "Behind Head Chest Stretch",
    "category": "Mobilidade",
    "description": "Sit upright on the floor with your partner behind you. Place your hands behind your hand, and push your elbows back as far as you can. Your partner should hold your elbows. This will be your starting position. Gently attempt to pull your elbows forward with your hands still behind your head for 10 or more seconds. Your partner should prevent your elbows from moving. Now, relax your muscles and have your partner gently pull the elbows back as far as it comfortable for you. Be sure to let your partner know when the stretch is adequate to prevent overstretching or injury.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Behind_Head_Chest_Stretch.gif"
  },
  {
    "name": "Brachialis-SMR",
    "category": "Mobilidade",
    "description": "Lie on your side, with your upper arm against the foam roller. The upper arm should be more or less aligned with your body, with the outside of the bicep pressed against the foam roller. Raise your hips off of the floor, supporting your weight on your arm and on your feet. Hold for 10-30 seconds, and then switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Brachialis-SMR.gif"
  },
  {
    "name": "Calf Stretch Elbows Against Wall",
    "category": "Mobilidade",
    "description": "Stand facing a wall from a couple feet away. Lean against the wall, placing your weight on your forearms. Attempt to keep your heels on the ground. Hold for 10-20 seconds. You may move further or closer the wall, making it more or less difficult, respectively.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Calf_Stretch_Elbows_Against_Wall.gif"
  },
  {
    "name": "Calf Stretch Hands Against Wall",
    "category": "Mobilidade",
    "description": "Stand facing a wall from several feet away. Stagger your stance, placing one foot forward. Lean forward and rest your hands on the wall, keeping your heel, hip and head in a straight line. Attempt to keep your heel on the ground. Hold for 10-20 seconds and then switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Calf_Stretch_Hands_Against_Wall.gif"
  },
  {
    "name": "Calves-SMR",
    "category": "Mobilidade",
    "description": "Begin seated on the floor. Place a foam roller underneath your lower leg. Your other leg can either be crossed over the opposite or be placed on the floor, supporting some of your weight. This will be your starting position. Place your hands to your side or just behind you, and press down to raise your hips off of the floor, placing much of your weight against your calf muscle. Roll from below the knee to above the ankle, pausing at points of tension for 10-30 seconds. Repeat for the other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Calves-SMR.gif"
  },
  {
    "name": "Cat Stretch",
    "category": "Mobilidade",
    "description": "Position yourself on the floor on your hands and knees. Pull your belly in and round your spine, lower back, shoulders, and neck, letting your head drop. Hold for 15 seconds.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Cat_Stretch.gif"
  },
  {
    "name": "Chair Leg Extended Stretch",
    "category": "Mobilidade",
    "description": "Sit upright in a chair and grip the seat on the sides. Raise one leg, extending the knee, flexing the ankle as you do so. Slowly move that leg outward as far as you can, and then back to the center and down. Repeat for your other leg.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chair_Leg_Extended_Stretch.gif"
  },
  {
    "name": "Chair Lower Back Stretch",
    "category": "Mobilidade",
    "description": "Sit upright on a chair. Bend to one side with your arm over your head. You can hold onto the chair with your free hand. Hold for 10 seconds, and repeat for your other side.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chair_Lower_Back_Stretch.gif"
  },
  {
    "name": "Chair Upper Body Stretch",
    "category": "Mobilidade",
    "description": "Sit on the edge of a chair, gripping the back of it. Straighten your arms, keeping your back straight, and pull your upper body forward so you feel a stretch. Hold for 20-30 seconds.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chair_Upper_Body_Stretch.gif"
  },
  {
    "name": "Chest And Front Of Shoulder Stretch",
    "category": "Mobilidade",
    "description": "Start off by standing with your legs together, holding a bodybar or a broomstick. Take a slightly wider than shoulder width grip on the pole and hold it in front of you with your palms facing down. Carefully lift the pole up and behind your head.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_And_Front_Of_Shoulder_Stretch.gif"
  },
  {
    "name": "Chest Stretch on Stability Ball",
    "category": "Mobilidade",
    "description": "Get on your hands and knees next to an exercise ball. Place your elbows on top of the ball, keeping your arm out to your side. This will be your starting position. Lower your torso towards the floor, keeping your elbow on top of the ball. Hold the stretch for 20-30 seconds, and repeat with the other arm.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chest_Stretch_on_Stability_Ball.gif"
  },
  {
    "name": "Child's Pose",
    "category": "Mobilidade",
    "description": "Get on your hands and knees, walk your hands in front of you. Lower your buttocks down to sit on your heels. Let your arms drag along the floor as you sit back to stretch your entire spine. Once you settle onto your heels, bring your hands next to your feet and relax. \"breathe\" into your back. Rest your forehead on the floor. Avoid this position if you have knee problems.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Childs_Pose.gif"
  },
  {
    "name": "Chin To Chest Stretch",
    "category": "Mobilidade",
    "description": "Get into a seated position on the floor. Place both hands at the rear of your head, fingers interlocked, thumbs pointing down and elbows pointing straight ahead. Slowly pull your head down to your chest. Hold for 20-30 seconds.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Chin_To_Chest_Stretch.gif"
  },
  {
    "name": "Crossover Reverse Lunge",
    "category": "Mobilidade",
    "description": "Stand with your feet shoulder width apart. This will be your starting position. Perform a rear lunge by stepping back with one foot and flexing the hips and front knee. As you do so, rotate your torso across the front leg. After a brief pause, return to the starting position and repeat on the other side, continuing in an alternating fashion.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Crossover_Reverse_Lunge.gif"
  },
  {
    "name": "Dancer's Stretch",
    "category": "Mobilidade",
    "description": "Sit up on the floor. Cross your right leg over your left, keeping the knee bent. Your left leg is straight and down on the floor. Place your left arm on your right leg and your right hand on the floor. Rotate your upper body to the right, and hold for 10-20 seconds. Switch sides.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Dancers_Stretch.gif"
  },
  {
    "name": "Dynamic Back Stretch",
    "category": "Mobilidade",
    "description": "Stand with your feet shoulder width apart. This will be your starting position. Keeping your arms straight, swing them straight up in front of you 5-10 times, increasing the range of motion each time until your arms are above your head.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Dynamic_Back_Stretch.gif"
  },
  {
    "name": "Dynamic Chest Stretch",
    "category": "Mobilidade",
    "description": "Stand with your hands together, arms extended directly in front of you. This will be your starting position. Keeping your arms straight, quickly move your arms back as far as possible and back in again, similar to an exaggerated clapping motion. Repeat 5-10 times, increasing speed as you do so.",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/Dynamic_Chest_Stretch.gif"
  }
];

  for (const ex of exercises) {
    await prisma.libraryExercise.create({
      data: {
        name: ex.name,
        category: ex.category,
        description: ex.description,
        imageUrl: ex.imageUrl,
        userId: null,
      },
    });
  }

  console.log(`${exercises.length} exercícios com GIFs inseridos com sucesso!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
