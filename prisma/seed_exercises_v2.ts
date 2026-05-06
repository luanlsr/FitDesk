// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de exercícios...");

  const exercises = [
    // --- PEITO (20) ---
    { name: "Supino Reto com Barra", category: "Peito", description: "Deite no banco, desça a barra até o peito e empurre para cima.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Supino Inclinado com Barra", category: "Peito", description: "Foco na parte superior do peito. Mantenha os cotovelos a 45 graus.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Supino Declinado com Barra", category: "Peito", description: "Foco na parte inferior do peito. Desça a barra controladamente.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Supino Reto com Halteres", category: "Peito", description: "Maior amplitude de movimento. Junte os halteres no topo.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Supino Inclinado com Halteres", category: "Peito", description: "Trabalha a estabilização e a parte superior do peitoral.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Crucifixo Reto com Halteres", category: "Peito", description: "Abra os braços mantendo uma leve flexão nos cotovelos.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Crucifixo Inclinado com Halteres", category: "Peito", description: "Foco no alongamento da parte superior do peito.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Crossover Polia Alta", category: "Peito", description: "Puxe os cabos de cima para baixo, cruzando as mãos.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Crossover Polia Baixa", category: "Peito", description: "Puxe os cabos de baixo para cima para focar no peito superior.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Fly na Máquina (Pec Deck)", category: "Peito", description: "Mantenha as costas no apoio e feche os braços à frente.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Flexão de Braços Clássica", category: "Peito", description: "Corpo alinhado, desça até quase tocar o chão e suba.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Flexão com Pés Elevados", category: "Peito", description: "Aumenta a carga na parte superior do peitoral.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Flexão Diamante", category: "Peito", description: "Mãos juntas formando um diamante. Foco no tríceps e peito interno.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Dips (Paralelas) para Peito", category: "Peito", description: "Incline o corpo para frente para focar no peitoral.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Supino na Máquina Articulada", category: "Peito", description: "Movimento guiado para máxima segurança e carga.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Pullover com Halter", category: "Peito", description: "Expande a caixa torácica. Leve o halter para trás da cabeça.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Apoio com Pegada Aberta", category: "Peito", description: "Foco na parte externa do peitoral.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Supino com Pegada Fechada", category: "Peito", description: "Foco no tríceps e parte interna do peito.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Press Arnold para Peito", category: "Peito", description: "Rotação dos punhos durante o movimento de supino.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Landmine Press", category: "Peito", description: "Empurre a barra apoiada no canto para cima e para frente.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },

    // --- COSTAS (20) ---
    { name: "Levantamento Terra", category: "Costas", description: "Mantenha a coluna neutra e use as pernas e costas para subir.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Remada Curvada com Barra", category: "Costas", description: "Incline o tronco e puxe a barra em direção ao umbigo.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Puxada Frontal (Pulldown)", category: "Costas", description: "Puxe a barra em direção à parte superior do peito.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Barra Fixa (Pull Up)", category: "Costas", description: "Suba até que o queixo ultrapasse a barra.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Chin Up (Pegada Supinada)", category: "Costas", description: "Barra fixa com palmas voltadas para você. Foco em bíceps e costas.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Remada Baixa Sentada", category: "Costas", description: "Puxe o triângulo em direção ao abdômen, estufando o peito.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Remada Unilateral com Halter (Serrote)", category: "Costas", description: "Apoie uma mão no banco e puxe o halter com a outra.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Puxada com Pegada Aproximada", category: "Costas", description: "Uso do triângulo na polia alta.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Face Pull", category: "Costas", description: "Puxe a corda em direção ao rosto, abrindo os cotovelos.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Remada Cavalinho (T-Bar Row)", category: "Costas", description: "Puxe a barra entre as pernas com as costas inclinadas.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Pulldown com Braços Esticados", category: "Costas", description: "Foco isolado no grande dorsal.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Remada na Máquina", category: "Costas", description: "Movimento controlado focando na contração das escápulas.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Lombar (Hyperextension)", category: "Costas", description: "Apoie o quadril e desça o tronco, subindo até alinhar com as pernas.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Remada Pendlay", category: "Costas", description: "Remada explosiva onde a barra toca o chão em cada repetição.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Puxada Unilateral na Polia", category: "Costas", description: "Trabalha assimetrias e estabilização.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Remada Alta na Polia Baixa", category: "Costas", description: "Puxe a barra em direção ao queixo.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Good Morning", category: "Costas", description: "Barra nas costas, incline o tronco para frente mantendo as pernas quase retas.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Remada Renegade", category: "Costas", description: "Em posição de prancha com halteres, puxe um de cada vez.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Superman (Chão)", category: "Costas", description: "Deitado de bruços, levante braços e pernas simultaneamente.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Remada com TRX/Fita", category: "Costas", description: "Use o peso do corpo para puxar-se em direção às fitas.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },

    // --- PERNAS (20) ---
    { name: "Agachamento Livre com Barra", category: "Pernas", description: "Desça o quadril mantendo a coluna reta e os joelhos alinhados.", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1bfc26ee7?q=80&w=500" },
    { name: "Leg Press 45º", category: "Pernas", description: "Empurre a plataforma com os pés, sem bloquear os joelhos no topo.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500" },
    { name: "Cadeira Extensora", category: "Pernas", description: "Foco isolado no quadríceps. Extensão total dos joelhos.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500" },
    { name: "Mesa Flexora", category: "Pernas", description: "Foco nos posteriores de coxa. Flexão dos joelhos deitado.", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500" },
    { name: "Cadeira Flexora", category: "Pernas", description: "Foco nos posteriores sentado.", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1bfc26ee7?q=80&w=500" },
    { name: "Afundo (Lunge) com Halteres", category: "Pernas", description: "Dê um passo à frente e desça o joelho de trás em direção ao chão.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500" },
    { name: "Avanço (Walking Lunge)", category: "Pernas", description: "Afundo em movimento contínuo.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500" },
    { name: "Agachamento Búlgaro", category: "Pernas", description: "Um pé apoiado atrás em um banco, agache com a outra perna.", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500" },
    { name: "Agachamento Hack", category: "Pernas", description: "Agachamento guiado em máquina.", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1bfc26ee7?q=80&w=500" },
    { name: "Agachamento Sumô", category: "Pernas", description: "Pés afastados e pontas para fora. Segure o peso entre as pernas.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500" },
    { name: "Stiff com Barra", category: "Pernas", description: "Desça a barra rente às pernas, sentindo alongar os posteriores.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500" },
    { name: "Levantamento Terra Romeno", category: "Pernas", description: "Variação do Stiff com leve flexão de joelhos.", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500" },
    { name: "Cadeira Adutora", category: "Pernas", description: "Trabalha a parte interna das coxas.", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1bfc26ee7?q=80&w=500" },
    { name: "Cadeira Abdutora", category: "Pernas", description: "Trabalha os glúteos e a lateral da coxa.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500" },
    { name: "Elevação de Quadril (Hip Thrust)", category: "Pernas", description: "Costas no banco, barra no quadril, empurre para cima.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500" },
    { name: "Extensão de Panturrilha em Pé", category: "Pernas", description: "Fique na ponta dos pés e desça controladamente.", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500" },
    { name: "Extensão de Panturrilha Sentado", category: "Pernas", description: "Foco no músculo sóleo da panturrilha.", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1bfc26ee7?q=80&w=500" },
    { name: "Flexão Nórdica", category: "Pernas", description: "Ajoelhado, desça o corpo controladamente usando os posteriores.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500" },
    { name: "Agachamento Goblet", category: "Pernas", description: "Segure um halter/kettlebell junto ao peito e agache.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500" },
    { name: "Subida no Banco (Step Up)", category: "Pernas", description: "Suba em um banco/caixa com uma perna de cada vez.", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500" },

    // --- OMBROS (20) ---
    { name: "Desenvolvimento com Barra Militar", category: "Ombros", description: "Empurre a barra acima da cabeça em pé.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Desenvolvimento com Halteres Sentado", category: "Ombros", description: "Mais estabilidade para focar nos deltoides.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Elevação Lateral com Halteres", category: "Ombros", description: "Abra os braços lateralmente até a altura dos ombros.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Elevação Frontal com Halteres", category: "Ombros", description: "Suba os halteres à frente do corpo.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Crucifixo Inverso (Deltoide Posterior)", category: "Ombros", description: "Incline o tronco e abra os halteres para trás.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Desenvolvimento Arnold", category: "Ombros", description: "Inicie com as palmas voltadas para você e gire ao subir.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Remada Alta com Barra", category: "Ombros", description: "Puxe a barra rente ao corpo até o queixo.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Elevação Lateral na Polia Unilateral", category: "Ombros", description: "Tensão constante em todo o movimento.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Encolhimento com Barra (Trapézio)", category: "Ombros", description: "Suba apenas os ombros em direção às orelhas.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Encolhimento com Halteres", category: "Ombros", description: "Variação com halteres ao lado do corpo.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Puxada Vertical com Halteres", category: "Ombros", description: "Similar à remada alta.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Elevação Lateral Inclinada (Banco)", category: "Ombros", description: "Deite de lado no banco inclinado para maior foco.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Face Pull para Posterior", category: "Ombros", description: "Foco na saúde do ombro e deltoide posterior.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Desenvolvimento na Máquina", category: "Ombros", description: "Movimento seguro e isolado.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Prancha com Toque no Ombro", category: "Ombros", description: "Trabalha estabilidade do ombro e core.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Y-Raise com Halteres", category: "Ombros", description: "Incline o corpo e suba os braços formando um Y.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },
    { name: "Elevação Frontal com Anilhas", category: "Ombros", description: "Segure uma anilha com as duas mãos e suba.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500" },
    { name: "Rotação Externa na Polia", category: "Ombros", description: "Saúde do manguito rotador.", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500" },
    { name: "Pike Push Up", category: "Ombros", description: "Flexão com quadril elevado, simulando desenvolvimento.", imageUrl: "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=500" },
    { name: "Flexão de Braços com Pés na Parede", category: "Ombros", description: "Nível avançado de flexão para ombros.", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" },

    // --- BRAÇOS (Bíceps/Tríceps) (20) ---
    { name: "Rosca Direta com Barra", category: "Braços", description: "Mantenha os cotovelos fixos e suba a barra.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Rosca Alternada com Halteres", category: "Braços", description: "Suba um halter de cada vez com rotação do punho.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Rosca Martelo", category: "Braços", description: "Halteres em posição neutra. Foco no braquial.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Rosca Scott", category: "Braços", description: "Apoie os braços no banco Scott para isolamento total.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Rosca Concentrada", category: "Braços", description: "Sentado, apoie o cotovelo na coxa e flexione.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Tríceps Pulley (Corda)", category: "Braços", description: "Puxe a corda para baixo abrindo no final.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Tríceps Pulley (Barra Reta)", category: "Braços", description: "Extensão de cotovelos na polia.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Tríceps Testa com Barra EZ", category: "Braços", description: "Deitado, desça a barra em direção à testa e suba.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Tríceps Francês Unilateral", category: "Braços", description: "Leve o halter por trás da cabeça e estique para cima.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Mergulho no Banco (Dips)", category: "Braços", description: "Use as mãos no banco para descer e subir o corpo.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Rosca Direta na Polia Baixa", category: "Braços", description: "Tensão constante para os bíceps.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Rosca Inversa (Antebraço)", category: "Braços", description: "Pegada pronada (palmas para baixo).", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Rosca 21", category: "Braços", description: "7 reps parciais baixo, 7 parciais cima, 7 completas.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Tríceps Coice com Halter", category: "Braços", description: "Incline o tronco e estique o braço para trás.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Tríceps Coice na Polia", category: "Braços", description: "Variação com polia para tensão constante.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Rosca Aranha (Spider Curl)", category: "Braços", description: "Deito de frente no banco inclinado, braços pendurados.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Tríceps Supinado (Pegada Fechada)", category: "Braços", description: "Supino focado no tríceps.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Flexão de Punho (Antebraço)", category: "Braços", description: "Sentado, apoie o braço e flexione apenas o punho.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Extensão de Punho (Antebraço)", category: "Braços", description: "Inverso da flexão de punho.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Tríceps na Máquina", category: "Braços", description: "Movimento de extensão guiado.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },

    // --- CORE (20) ---
    { name: "Abdominal Crunch Clássico", category: "Core", description: "Suba o tronco levemente contraindo o abdômen.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Prancha Abdominal (Plank)", category: "Core", description: "Mantenha o corpo reto apoiado nos cotovelos e pés.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Elevação de Pernas (Deitado)", category: "Core", description: "Mantenha as pernas retas e suba até 90 graus.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Elevação de Pernas Pendurado", category: "Core", description: "Trabalha o abdômen inferior intensamente.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Abdominal Infra no Banco", category: "Core", description: "Similar à elevação de pernas, feito no banco.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Russian Twist", category: "Core", description: "Sentado, gire o tronco de um lado para o outro.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Abdominal Bicicleta", category: "Core", description: "Gire o tronco levando o cotovelo ao joelho oposto.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Prancha Lateral", category: "Core", description: "Foco nos oblíquos.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Mountain Climbers", category: "Core", description: "Em posição de prancha, leve os joelhos ao peito alternadamente.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Abdominal na Polia Alta (Crunch Cable)", category: "Core", description: "Ajoelhado, puxe o cabo para baixo contraindo o abdômen.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Deadbug", category: "Core", description: "Coordenação e estabilidade profunda do core.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Bird Dog", category: "Core", description: "Estenda braço e perna opostos em quatro apoios.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Roda Abdominal (Ab Wheel)", category: "Core", description: "Role para frente e volte usando apenas o abdômen.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Hollow Body Hold", category: "Core", description: "Posição de 'canoa' isométrica.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Abdominal Canivete", category: "Core", description: "Pernas e braços se encontram no topo.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Windshield Wipers (Limpador)", category: "Core", description: "Pernas elevadas, gire-as lateralmente.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Toes to Bar", category: "Core", description: "Leve os pés até a barra de pull up.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Prancha com Elevação de Perna", category: "Core", description: "Desafio extra para glúteos e core.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Abdominal Remador", category: "Core", description: "Estenda-se e sente-se abraçando os joelhos.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
    { name: "Side Plank with Rotation", category: "Core", description: "Prancha lateral com giro do tronco.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },

    // --- CARDIO (20) ---
    { name: "Corrida na Esteira", category: "Cardio", description: "Ajuste velocidade e inclinação conforme seu nível.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Bicicleta Ergométrica", category: "Cardio", description: "Ótimo para baixo impacto articular.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Elíptico", category: "Cardio", description: "Movimento fluido para corpo todo.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Pular Corda", category: "Cardio", description: "Alta intensidade e coordenação.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Burpees", category: "Cardio", description: "Agachamento, prancha, flexão e salto.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Polichinelos (Jumping Jacks)", category: "Cardio", description: "Aquecimento clássico de corpo todo.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Remo Indoor", category: "Cardio", description: "Trabalha costas, pernas e condicionamento.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Subir Escadas (Stairmaster)", category: "Cardio", description: "Intenso para pernas e glúteos.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Battle Ropes", category: "Cardio", description: "Ondas explosivas com cordas navais.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Box Jumps", category: "Cardio", description: "Salte em uma caixa alta e desça suavemente.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "High Knees (Corrida Estática)", category: "Cardio", description: "Suba os joelhos até a altura do quadril rapidamente.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Sprints (Tiros de Corrida)", category: "Cardio", description: "Corrida em velocidade máxima por curto tempo.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Natação", category: "Cardio", description: "Excelente para resistência cardiovascular total.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Assault Bike", category: "Cardio", description: "Bike que usa braços e pernas com resistência de ar.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Kettlebell Swings", category: "Cardio", description: "Movimento explosivo de quadril.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Shadow Boxing", category: "Cardio", description: "Simulação de luta para queima calórica.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Squat Jumps", category: "Cardio", description: "Agachamento seguido de salto explosivo.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Speed Skaters", category: "Cardio", description: "Saltos laterais simulando patinação.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Prancha com Salto (Plank Jacks)", category: "Cardio", description: "Em prancha, abra e feche as pernas saltando.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Bear Crawl (Caminhada do Urso)", category: "Cardio", description: "Ande em quatro apoios sem tocar os joelhos no chão.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },

    // --- MOBILIDADE/OUTROS (20) ---
    { name: "Alongamento Cobra", category: "Mobilidade", description: "Deitado, empurre o chão subindo o peito para alongar o abdômen.", imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=500" },
    { name: "Posição da Criança (Child's Pose)", category: "Mobilidade", description: "Ajoelhado, sente nos calcanhares e estique os braços à frente.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Cat-Cow (Gato e Vaca)", category: "Mobilidade", description: "Mobilidade de coluna em quatro apoios.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Alongamento de Isquiotibiais", category: "Mobilidade", description: "Tente tocar os pés com as pernas esticadas.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "World's Greatest Stretch", category: "Mobilidade", description: "Sequência completa para quadril e torácica.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Agachamento Profundo Isométrico", category: "Mobilidade", description: "Segure no fundo do agachamento para abrir o quadril.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Mobilidade de Tornozelo", category: "Mobilidade", description: "Force o joelho à frente do pé sem tirar o calcanhar do chão.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Thread the Needle", category: "Mobilidade", description: "Em quatro apoios, passe um braço por baixo do outro.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Rotação de Quadril (90-90)", category: "Mobilidade", description: "Sentado, coloque pernas em 90 graus e gire para o outro lado.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Escorpião", category: "Mobilidade", description: "Deitado, leve um pé em direção à mão oposta por trás.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Wall Slide (Anjo na Parede)", category: "Mobilidade", description: "Costas na parede, deslize os braços sem perder contato.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Mobilidade de Punho", category: "Mobilidade", description: "Giro e pressão leve nos punhos.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Alongamento de Flexores de Quadril", category: "Mobilidade", description: "Um joelho no chão, empurre o quadril à frente.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Pigeon Pose (Pombo)", category: "Mobilidade", description: "Alongamento intenso de glúteo e piriforme.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Foam Rolling (Liberação Miofascial)", category: "Mobilidade", description: "Use o rolo de espuma para massagear os músculos.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Mobilidade de Ombro com Bastão", category: "Mobilidade", description: "Gire o bastão para trás e para frente com braços retos.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
    { name: "Alongamento de Peitoral na Parede", category: "Mobilidade", description: "Apoie o braço na parede e gire o corpo oposto.", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=500" },
    { name: "Cachorro Olhando para Baixo", category: "Mobilidade", description: "Posição clássica do Yoga para alongamento posterior.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
    { name: "Mobilidade Torácica (Open Book)", category: "Mobilidade", description: "Deitado de lado, abra o braço de cima até tocar o outro lado.", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500" },
    { name: "Prancha Ativa com Downward Dog", category: "Mobilidade", description: "Alternância entre prancha e cachorro olhando para baixo.", imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=500" },
  ];

  for (const ex of exercises) {
    await prisma.libraryExercise.create({
      data: {
        name: ex.name,
        category: ex.category,
        description: ex.description,
        imageUrl: ex.imageUrl,
        userId: null, // Global
      },
    });
  }

  console.log(`${exercises.length} exercícios inseridos com sucesso!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
